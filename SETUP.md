# Quick Setup Guide

## Prerequisites
- Node.js 18 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**Important**: Replace `sk-proj-your-actual-key-here` with your actual OpenAI API key.

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to [http://localhost:3001](http://localhost:3001)

## Usage

1. **Upload Resume**: Drag & drop or click to browse for your PDF/DOCX resume
2. **Paste Job Description**: Copy the full job posting into the text area
3. **Click "Generate Tailored Resume"**: Wait ~20-30 seconds
4. **Download**: Your tailored resume will download automatically as a PDF

## Troubleshooting

### "Missing credentials" error
- Check that `.env.local` exists in the project root
- Verify your OpenAI API key is correctly set
- Restart the development server after adding the key

### "Could not extract text from resume"
- Ensure your PDF is not password-protected or image-only
- Try converting to DOCX format
- Check file size (must be under 10MB)

### Build errors
```bash
# Clean install if needed
rm -rf node_modules .next
npm install
npm run build
```

## Tech Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- OpenAI GPT-4
- pdf-lib for PDF generation

## File Size Limits
- Maximum upload size: 10MB
- Supported formats: PDF, DOCX

## Privacy
- No data is stored
- Files are processed in memory only
- Deleted immediately after download

