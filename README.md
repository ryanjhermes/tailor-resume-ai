# Resume Tailor - AI-Powered Resume Optimization

Transform any resume into the perfect match for your dream job in seconds.

## Features

- 🎯 **Smart Resume Matching** - Upload your resume in PDF or DOCX format
- 🤖 **Ethical AI Enhancement** - Zero hallucination guarantee, never invents fake experiences
- 📄 **Professional PDF Output** - Clean, modern one-page format optimized for ATS systems
- ⚡ **Lightning Fast** - Complete resume tailoring in under 30 seconds
- 🎨 **Premium User Experience** - Modern gradient design with intuitive interface

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

You can get an API key from [OpenAI's platform](https://platform.openai.com/api-keys).

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Usage

1. **Upload Your Resume** - Drag and drop or browse for your PDF/DOCX resume
2. **Paste Job Description** - Copy the full job posting into the text area
3. **Generate** - Click the button and wait ~20-30 seconds
4. **Download** - Your tailored resume will automatically download as a PDF

## How It Works

1. **Resume Parsing** - Extracts text from your uploaded PDF or DOCX file
2. **AI Analysis** - Uses GPT-4 to analyze your resume against the job description
3. **Smart Reorganization** - Restructures and rewords content to highlight relevant experience
4. **PDF Generation** - Creates a professional, ATS-friendly one-page resume
5. **No Data Storage** - Files are processed in memory and deleted immediately

## Technical Stack

- **Frontend**: Next.js 15 with React and TypeScript
- **Styling**: Tailwind CSS with custom gradient design
- **AI**: OpenAI GPT-4 API
- **PDF Processing**: pdf-parse (reading), pdf-lib (generation)
- **DOCX Processing**: mammoth
- **File Uploads**: FormData with 10MB limit

## Important Notes

- **No Fabrication**: The AI only reorganizes and rewords your existing experiences
- **Privacy**: No data is stored; all processing happens in memory
- **File Limits**: Maximum 10MB file size for uploads
- **One Page**: Output resumes are optimized for one-page format
- **ATS Friendly**: Uses standard fonts and formatting for compatibility

## Requirements

- Node.js 18+ 
- OpenAI API key with access to GPT-4
- Internet connection for API calls

## Troubleshooting

### "Could not extract text from resume"
- Ensure your PDF is not password-protected or image-based
- Try converting your resume to DOCX format
- Check that the file is not corrupted

### "Failed to generate resume"
- Verify your OpenAI API key is correct in `.env.local`
- Check your OpenAI account has available credits
- Ensure you have internet connectivity

### API errors
- Make sure you're using GPT-4 (not GPT-3.5) for best results
- Check OpenAI API status if requests are failing

## License

MIT License - Feel free to use this for personal or commercial projects.

## Support

For issues or questions, please check:
- Your `.env.local` file is properly configured
- Your OpenAI API key is valid and has credits
- File uploads are under 10MB
- Files are in PDF or DOCX format

---

Built with ❤️ for job seekers everywhere.
