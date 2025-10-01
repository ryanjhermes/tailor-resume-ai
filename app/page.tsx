'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(droppedFile);
      } else {
        setError('Please upload a PDF or DOCX file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
      } else {
        setError('Please upload a PDF or DOCX file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !jobDescription.trim()) {
      setError('Please upload a resume and paste a job description');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('/api/tailor-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate resume');
      }

      // Get the PDF blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // Preserve original filename but change extension to PDF
      const originalName = file.name;
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
      a.download = `${nameWithoutExt}.pdf`;
      
      a.href = url;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset form
      setFile(null);
      setJobDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navigation */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-semibold text-white">Resume Tailor</span>
            </div>
            <a 
              href="https://github.com/ryanjhermes/tailor-resume-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm">GitHub (we're open source!)</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12 mt-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Tailor Your Resume for Any Job
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-tight">
            Transform any resume into the perfect match for your dream job in seconds
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Side by Side Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* File Upload Section */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Upload Resume
                </h2>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-500/5'
                      : 'border-neutral-700 bg-neutral-800/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg">{file.name}</p>
                        <p className="text-neutral-400 text-sm mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-neutral-400 hover:text-white text-sm transition-colors"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-lg font-medium mb-2">
                          Drag and drop your resume here
                        </p>
                        <p className="text-neutral-400 mb-4">or</p>
                        <label className="inline-block">
                          <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <span className="cursor-pointer bg-white hover:bg-neutral-100 text-black font-medium py-2 px-4 rounded-lg transition-colors inline-block text-sm">
                            Browse Files
                          </span>
                        </label>
                        <p className="text-neutral-500 text-sm mt-3">
                          Supports PDF and DOCX formats
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Section */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Job Description
                </h2>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description you're applying for here..."
                  className="w-full h-56 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm leading-relaxed"
                />
                <p className="text-neutral-500 text-sm mt-3">
                  Include the full job posting for best results
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || !file || !jobDescription.trim()}
                className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all ${
                  loading || !file || !jobDescription.trim()
                    ? 'bg-neutral-700 cursor-not-allowed text-neutral-500'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Resume...
                  </span>
                ) : (
                  'Generate Tailored Resume'
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
