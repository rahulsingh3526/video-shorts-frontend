import { useState } from 'react';
import { Upload, Video, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export default function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processingMessage, setProcessingMessage] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatus('idle');
      setDownloadUrl('');
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;

    try {
      setStatus('uploading');
      setProcessingMessage('Uploading your video...');

      const formData = new FormData();
      formData.append('video', selectedFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://video-shorts-backend.onrender.com';
      console.log('API URL being used:', apiUrl); // Debug log
      
      const response = await fetch(`${apiUrl}/api/upload-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Update to processing status
      setStatus('processing');
      setProcessingMessage('Processing your video into shorts format...');

      const result = await response.json();
      console.log('Backend response:', result); // Debug the actual response
      
      if (result.success) {
        setStatus('completed');
        setProcessingMessage('Video processed to shorts successfully!');
        const fullDownloadUrl = `${apiUrl}/${result.downloadUrl}`;
        console.log('Download URL constructed:', fullDownloadUrl);
        setDownloadUrl(fullDownloadUrl);
      } else {
        // Show the actual backend error instead of generic message
        const errorMsg = result.error || 'Processing failed';
        console.error('Backend processing error:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        // Show the actual error message from backend
        setProcessingMessage(`Error: ${error.message}`);
      } else {
        setProcessingMessage('Something went wrong. Please try again.');
      }
      console.error('Processing error:', error);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setStatus('idle');
    setDownloadUrl('');
    setProcessingMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Video className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Video to Shorts</h2>
      </div>

      {status === 'idle' && (
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="video-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Drop your video here, or{' '}
                  <span className="text-blue-600 hover:text-blue-500">browse</span>
                </span>
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Supports MP4, MOV, AVI up to 100MB
            </p>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}

          {/* Process Button */}
          {selectedFile && (
            <button
              onClick={handleUploadAndProcess}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Convert to Shorts
            </button>
          )}
        </div>
      )}

      {/* Processing States */}
      {(status === 'uploading' || status === 'processing') && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <p className="text-lg font-medium text-gray-900">{processingMessage}</p>
          </div>
          <p className="text-sm text-gray-600">
            Converting landscape video to vertical shorts format...
          </p>
        </div>
      )}

      {/* Completed State */}
      {status === 'completed' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Video Ready!</h3>
          <p className="text-gray-600">{processingMessage}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5" />
                <span>Download Short Video</span>
              </a>
            )}
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Upload className="h-5 w-5" />
              <span>Process Another</span>
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Processing Failed</h3>
          <p className="text-gray-600">{processingMessage}</p>
          
          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Upload className="h-5 w-5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}