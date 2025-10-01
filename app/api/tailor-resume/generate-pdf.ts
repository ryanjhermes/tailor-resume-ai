import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generatePDF(resumeData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  
  // Load fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  const margin = 50;
  const pageWidth = 612;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 792 - margin; // Start from top
  
  const black = rgb(0, 0, 0);
  const lineHeight = 1.15;
  
  // Helper function to wrap text
  function wrapText(text: string, maxWidth: number, fontSize: number, font: any): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  // Draw text centered
  function drawCenteredText(text: string, y: number, fontSize: number, font: any) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const x = (pageWidth - textWidth) / 2;
    page.drawText(text, { x, y, size: fontSize, font, color: black });
  }
  
  // Draw text left-aligned
  function drawText(text: string, x: number, y: number, fontSize: number, font: any) {
    page.drawText(text, { x, y, size: fontSize, font, color: black });
  }
  
  // Draw wrapped text
  function drawWrappedText(text: string, x: number, y: number, fontSize: number, font: any, maxWidth: number): number {
    const lines = wrapText(text, maxWidth, fontSize, font);
    let currentY = y;
    
    lines.forEach(line => {
      drawText(line, x, currentY, fontSize, font);
      currentY -= fontSize * lineHeight;
    });
    
    return currentY;
  }
  
  // NAME
  drawCenteredText(resumeData.name || 'Name', yPosition, 24, helveticaBold);
  yPosition -= 26;
  
  // CONTACT INFO
  const contactParts = [];
  if (resumeData.contact?.email) contactParts.push(resumeData.contact.email);
  if (resumeData.contact?.phone) contactParts.push(resumeData.contact.phone);
  if (resumeData.contact?.location) contactParts.push(resumeData.contact.location);
  if (resumeData.contact?.linkedin) contactParts.push(resumeData.contact.linkedin);
  if (resumeData.contact?.website) contactParts.push(resumeData.contact.website);
  
  if (contactParts.length > 0) {
    drawCenteredText(contactParts.join(' • '), yPosition, 10, helvetica);
    yPosition -= 16;
  }
  
  // Horizontal line after contact
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 1,
    color: black,
  });
  yPosition -= 12;
  
  // Helper function to draw section divider
  const drawSectionDivider = () => {
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: pageWidth - margin, y: yPosition },
      thickness: 1,
      color: black,
    });
    yPosition -= 10;
  };
  
  // Check which sections exist in the data
  const hasExperience = resumeData.experience && resumeData.experience.length > 0;
  const hasEducation = resumeData.education && resumeData.education.length > 0;
  const hasProjects = resumeData.projects && resumeData.projects.length > 0;
  const hasSkills = Array.isArray(resumeData.skills) ? resumeData.skills.length > 0 : 
    (resumeData.skills && ((resumeData.skills.technical && resumeData.skills.technical.length > 0) ||
     (resumeData.skills.other && resumeData.skills.other.length > 0)));

  // EXPERIENCE
  if (hasExperience) {
    drawText('EXPERIENCE', margin, yPosition, 12, helveticaBold);
    yPosition -= 15;
    
    resumeData.experience.forEach((exp: any) => {
      if (yPosition < 100) return;
      
      // Job title
      drawText(exp.title || '', margin, yPosition, 11, helveticaBold);
      yPosition -= 12;
      
      // Company and location
      const companyText = exp.location ? `${exp.company} • ${exp.location}` : exp.company;
      drawText(companyText || '', margin, yPosition, 10, helveticaOblique);
      yPosition -= 12;
      
      // Dates
      drawText(exp.dates || '', margin, yPosition, 9, helvetica);
      yPosition -= 12;
      
      // Bullets
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet: string) => {
          if (yPosition < 100) return;
          drawText('•', margin, yPosition, 10, helvetica);
          yPosition = drawWrappedText(bullet, margin + 15, yPosition, 10, helvetica, contentWidth - 15);
          yPosition -= 4;
        });
      }
      
      yPosition -= 6;
    });
    
    // Only draw divider if there are more sections and space
    if ((hasEducation && yPosition > 100) || (hasProjects && yPosition > 100) || (hasSkills && yPosition > 80)) {
      drawSectionDivider();
    }
  }
  
  // EDUCATION
  if (hasEducation && yPosition > 100) {
    drawText('EDUCATION', margin, yPosition, 12, helveticaBold);
    yPosition -= 15;
    
    resumeData.education.forEach((edu: any) => {
      if (yPosition < 100) return;
      
      drawText(edu.degree || '', margin, yPosition, 11, helveticaBold);
      yPosition -= 12;
      
      const schoolText = edu.location ? `${edu.school} • ${edu.location}` : edu.school;
      drawText(schoolText || '', margin, yPosition, 10, helveticaOblique);
      yPosition -= 12;
      
      drawText(edu.date || '', margin, yPosition, 10, helvetica);
      yPosition -= 10;
      
      if (edu.details) {
        yPosition = drawWrappedText(edu.details, margin, yPosition, 10, helvetica, contentWidth);
        yPosition -= 6;
      }
      
      yPosition -= 5;
    });
    
    // Only draw divider if there are more sections and space
    if ((hasProjects && yPosition > 100) || (hasSkills && yPosition > 80)) {
      drawSectionDivider();
    }
  }
  
  // PROJECTS
  if (hasProjects && yPosition > 100) {
    drawText('PROJECTS', margin, yPosition, 12, helveticaBold);
    yPosition -= 15;
    
    resumeData.projects.forEach((project: any) => {
      if (yPosition < 100) return;
      
      drawText(project.name || '', margin, yPosition, 11, helveticaBold);
      yPosition -= 12;
      
      if (project.description) {
        yPosition = drawWrappedText(project.description, margin, yPosition, 10, helvetica, contentWidth);
        yPosition -= 4;
      }
      
      if (project.bullets && project.bullets.length > 0) {
        project.bullets.forEach((bullet: string) => {
          if (yPosition < 100) return;
          drawText('•', margin, yPosition, 10, helvetica);
          yPosition = drawWrappedText(bullet, margin + 15, yPosition, 10, helvetica, contentWidth - 15);
          yPosition -= 4;
        });
      }
      
      yPosition -= 6;
    });
    
    // Only draw divider if Skills section follows and there's space
    if (hasSkills && yPosition > 80) {
      drawSectionDivider();
    }
  }
  
  // SKILLS - Last section, never has a divider after
  if (hasSkills && yPosition > 80) {
    drawText('SKILLS', margin, yPosition, 12, helveticaBold);
    yPosition -= 15;
    
    // Handle new array format (preferred - single comprehensive list)
    if (Array.isArray(resumeData.skills)) {
      const skillsText = resumeData.skills.join(', ');
      yPosition = drawWrappedText(skillsText, margin, yPosition, 10, helvetica, contentWidth);
    }
    // Backward compatibility with old categorized format
    else if (resumeData.skills && typeof resumeData.skills === 'object') {
      if (resumeData.skills.technical && resumeData.skills.technical.length > 0) {
        const techSkills = resumeData.skills.technical.join(', ');
        const boldWidth = helveticaBold.widthOfTextAtSize('Technical: ', 10);
        drawText('Technical: ', margin, yPosition, 10, helveticaBold);
        yPosition = drawWrappedText(techSkills, margin + boldWidth, yPosition, 10, helvetica, contentWidth - boldWidth);
        yPosition -= 6;
      }
      
      if (resumeData.skills.other && resumeData.skills.other.length > 0) {
        const otherSkills = resumeData.skills.other.join(', ');
        const boldWidth = helveticaBold.widthOfTextAtSize('Other: ', 10);
        drawText('Other: ', margin, yPosition, 10, helveticaBold);
        yPosition = drawWrappedText(otherSkills, margin + boldWidth, yPosition, 10, helvetica, contentWidth - boldWidth);
      }
    }
    // No divider after Skills - it's the last section
  }
  
  return pdfDoc.save();
}

