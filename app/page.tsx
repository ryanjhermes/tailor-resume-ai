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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Futuristic corner outlines */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top-left corner */}
        <div className="absolute top-0 left-0 w-32 h-32">
          <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute top-0 left-0 w-1 h-24 bg-gradient-to-b from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute top-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/70"></div>
        </div>
        
        {/* Top-right corner */}
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-l from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute top-0 right-0 w-1 h-24 bg-gradient-to-b from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute top-6 right-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/70"></div>
        </div>
        
        {/* Bottom-left corner */}
        <div className="absolute bottom-0 left-0 w-32 h-32">
          <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute bottom-0 left-0 w-1 h-24 bg-gradient-to-t from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/70"></div>
        </div>
        
        {/* Bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-32 h-32">
          <div className="absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-l from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute bottom-0 right-0 w-1 h-24 bg-gradient-to-t from-purple-400 to-purple-500 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute bottom-6 right-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/70"></div>
        </div>
      </div>


      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 flex-shrink-0 pt-8">
          <div className="flex items-center justify-center space-x-6">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              RESUME TAILOR
            </h1>
            <a 
              href="https://github.com/ryanjhermes/tailor-resume-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1 flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* Side by Side Layout */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto px-8">
              {/* File Upload Section */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                  <h2 className="text-xl font-bold text-white tracking-wide font-mono">
                    UPLOAD RESUME
                  </h2>
                </div>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 flex-1 flex flex-col justify-center min-h-96 ${
                    dragActive
                      ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                      : 'border-gray-700 bg-gray-900/30 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-400/50">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg font-mono tracking-wide">{file.name}</p>
                        <p className="text-white text-sm mt-2 font-mono">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR PROCESSING
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-white hover:text-gray-400 text-sm transition-colors font-mono tracking-wide hover:underline"
                      >
                        REMOVE FILE
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <span className="cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 inline-block text-sm font-mono tracking-wide shadow-lg hover:shadow-cyan-500/25 hover:scale-105">
                          UPLOAD RESUME
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Section */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                  <h2 className="text-xl font-bold text-white tracking-wide font-mono">
                    JOB DESCRIPTION
                  </h2>
                </div>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex-1 flex flex-col justify-center min-h-96 hover:border-purple-400/50 transition-all duration-300">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="PASTE JOB DESCRIPTION HERE..."
                    className="w-full h-full px-2 py-2 rounded-lg bg-transparent text-white placeholder-white focus:outline-none focus:ring-0 focus:border-transparent resize-none text-sm leading-relaxed font-mono transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 max-w-5xl mx-auto px-8">
              <button
                type="submit"
                disabled={loading || !file || !jobDescription.trim()}
                className={`relative px-12 py-4 rounded-xl font-black text-lg transition-all duration-500 font-mono tracking-widest ${
                  loading || !file || !jobDescription.trim()
                    ? 'bg-gray-800 cursor-not-allowed text-white border border-gray-700'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 hover:scale-105 border border-cyan-400/50'
                }`}
              >
                {loading ? (
                  <span className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>PROCESSING...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-3">
                    <span>GENERATE RESUME</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </span>
                )}
                {!loading && file && jobDescription.trim() && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 shadow-lg shadow-red-500/20 max-w-5xl mx-auto px-8 mt-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-white text-center font-mono tracking-wide">{error}</p>
                </div>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
