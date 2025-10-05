import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generatePDF } from './generate-pdf';
import { getOpenAIKey } from '../lib/secrets';

// Get OpenAI client (async because we fetch from Secrets Manager)
async function getOpenAIClient() {
  const apiKey = await getOpenAIKey();
  return new OpenAI({
    apiKey,
  });
}

// Parse resume based on file type
async function parseResume(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')) {
    // Use pdf-parse - the most reliable Node.js PDF parser
    // No workers, no complex setup, just works in serverless environments
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name?.toLowerCase().endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  
  throw new Error('Unsupported file format');
}

// Call OpenAI to tailor resume
async function tailorResumeWithAI(resumeText: string, jobDescription: string): Promise<any> {
  const prompt = `You are an expert resume writer and career coach. Your task is to rebuild an existing resume to match a specific job description.

IMPORTANT RULES:
You will tailor the resume to match the job description.

ORIGINAL RESUME:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

Please analyze both documents and create a tailored resume that:
- Reorganizes sections to prioritize the most relevant information for the job description
- VERY IMPORTANT: REWORD bullet points to align with job responsibilites. MAKE SURE THE RESUME ALIGNS WELL WITH THE JOB. If this means replacing a bullet point with a new one, do it, so that it aligns with the job description.
- Emphasizes transferable skills that match the job
- Maintains relative factual accuracy from the original resume
- Extract key technical skills and competencies mentioned in the job description that align with the candidate's experience
- Do not include a professional summary section to save space for more experience details
- Try to avoid removing whole experiences, find ways to keep them but make them more relevant to the job description
- ALWAYS include a comprehensive skills section at the BOTTOM of the resume
- Include MANY skills (15-20+) as a single array from BOTH the original resume AND the job description
- Prioritize skills mentioned in the job description first, then add relevant skills from the resume
- Include technical skills, tools, languages, frameworks, methodologies, and soft skills all in one list

DO NOT miss any of these bullets.

Return the tailored resume in the following JSON structure:
{
  "name": "Full Name",
  "contact": {
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State",
    "linkedin": "LinkedIn URL (if available)",
    "website": "Personal website (if available)"
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "dates": "Start Date - End Date",
      "bullets": ["Achievement/responsibility", "Achievement/responsibility"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "location": "City, State",
      "date": "Graduation Date",
      "details": "GPA, honors, relevant coursework (if applicable)"
    }
  ],
  "skills": ["Python", "JavaScript", "SQL", "Power BI", "Azure", "AWS", "Machine Learning", "Data Analysis", "Agile", "Leadership", "Problem-solving", "Communication", "Project Management"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "bullets": ["Achievement", "Technology used"]
    }
  ]
}
`;

  const openai = await getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume writer. You only reorganize and reword existing information - you never fabricate experiences or skills.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  return JSON.parse(content);
}

export async function POST(request: NextRequest) {
  try {
    console.log('Tailor resume API called');
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!resumeFile || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume file and job description are required' },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    if (resumeFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Parse the resume
    const resumeText = await parseResume(resumeFile);

    if (!resumeText || resumeText.trim().length === 0) {
      console.error('Resume text is empty or invalid');
      return NextResponse.json(
        { error: 'Could not extract text from resume' },
        { status: 400 }
      );
    }

    // Tailor resume using AI
    const tailoredResume = await tailorResumeWithAI(resumeText, jobDescription);

    // Generate PDF
    const pdfBytes = await generatePDF(tailoredResume);

    // Return PDF
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="tailored-resume.pdf"',
      },
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

