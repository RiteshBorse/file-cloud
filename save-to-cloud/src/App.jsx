import { useState, useRef, useEffect } from 'react';
import React from 'react';
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const dummy = async () => {
    const res = await fetch(import.meta.env.VITE_API);
  }
  useEffect(() => {
      dummy();
  } , [])

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setMessage('File size must be less than 1MB');
        setSelectedFile(null);
        setUploadedImage(null);
        return;
      }
      setSelectedFile(file);
      setUploadedImage(null);
      setMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setMessage('File size must be less than 1MB');
        setSelectedFile(null);
        setUploadedImage(null);
        return;
      }
      setSelectedFile(file);
      setUploadedImage(null);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('uploadfile', selectedFile);

      const response = await fetch(`${import.meta.env.VITE_API}/imageUpload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImage(result.image);
        setMessage(result.message);
      } else {
        setMessage(result.message || 'Upload failed');
      }
    } catch (error) {
      setMessage('Error uploading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (uploadedImage) {
      try {
        await navigator.clipboard.writeText(uploadedImage);
        setMessage('Image URL copied to clipboard!');
      } catch (error) {
        setMessage('Failed to copy to clipboard');
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadedImage(null);
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-2/3 h-[90vh] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/20 overflow-hidden flex flex-col">
        {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M18.5 12C18.5 7.85786 15.1421 4.5 11 4.5C6.85786 4.5 3.5 7.85786 3.5 12C3.5 16.1421 6.85786 19.5 11 19.5H18.5C20.433 19.5 22 17.933 22 16C22 14.067 20.433 12.5 18.5 12.5Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
                </div>
                <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">FileCloud</h1>
            <p className='text-sm text-white mt-2'>Made by Ritesh Borse</p>
                </div>
              </div>
              <p className="text-blue-100 text-lg font-medium">Secure cloud storage for your files</p>
            </div>
            {/* Floating elements */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
          </div>

          {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              
              <label 
                htmlFor="file-upload" 
                className={`group relative block p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
                  dragOver 
                    ? 'border-blue-500 bg-blue-50 scale-105' 
                    : selectedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 hover:scale-105'
                } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    selectedFile ? 'bg-green-100' : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    {selectedFile ? (
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    )}
                  </div>
                  
                  <div>
                    <div className={`text-xl font-semibold mb-2 ${selectedFile ? 'text-green-700' : 'text-gray-700'}`}>
                      {selectedFile ? selectedFile.name : 'Choose a file to upload'}
                    </div>
                    <div className="text-gray-500">
                      {selectedFile ? 'Click to change file' : 'Drag and drop your image here, or click to browse'}
                    </div>
                    {!selectedFile && (
                      <div className="mt-2 text-sm text-gray-400">
                        Supports: JPG, PNG, GIF, WebP (Max: 1MB)
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  className={`flex-1 relative overflow-hidden py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                    !selectedFile || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg shadow-blue-500/25'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload File</span>
                    </div>
                  )}
                </button>

                {selectedFile && (
                  <button
                    onClick={resetUpload}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                uploadedImage 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {uploadedImage ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{message}</span>
              </div>
            )}

            {/* Upload Result */}
            {uploadedImage && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Upload Successful!</h3>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded file" 
                    className="w-full h-auto max-h-64 object-contain rounded-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-green-800">Image URL:</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={uploadedImage}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white border border-green-200 rounded-xl text-gray-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;