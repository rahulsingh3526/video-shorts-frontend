import { useState } from 'react';
import { Upload, Video, Download, Clock, CheckCircle, AlertCircle, Cloud } from 'lucide-react';
import { uploadVideoToCloudinary, processVideoWithCloudinary, ProcessingOptions, VideoProcessingResult } from '@/lib/cloudinary';

type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
type ProcessingMode = 'simple' | 'advanced';

export default function CloudinaryVideoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('advanced');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingTime, setProcessingTime] = useState<number>(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (Cloudinary free tier allows up to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setProcessingMessage('File too large. Maximum size is 100MB.');
        setStatus('error');
        return;
      }
      
      setSelectedFile(file);
      setStatus('idle');
      setDownloadUrl('');
      setUploadProgress(0);
      setProcessingTime(0);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;

    try {
      const startTime = Date.now();
      
      // Step 1: Upload to Cloudinary
      setStatus('uploading');
      setProcessingMessage('Uploading to Cloudinary...');
      
      const uploadResult = await uploadVideoToCloudinary(selectedFile, (progress) => {
        setUploadProgress(progress);
        setProcessingMessage(`Uploading to Cloudinary... ${Math.round(progress)}%`);
      });

      console.log('Upload successful:', uploadResult);

      // Step 2: Process video using Cloudinary transformations
      setStatus('processing');
      setUploadProgress(100);
      
      if (processingMode === 'advanced') {
        setProcessingMessage('Creating split-screen video with Minecraft background...');
      } else {
        setProcessingMessage('Converting to vertical format...');
      }

      const processingOptions: ProcessingOptions = {
        mode: processingMode,
        quality: 'auto',
        outputFormat: 'mp4'
      };

      const result: VideoProcessingResult = await processVideoWithCloudinary(
        uploadResult.publicId, 
        processingOptions
      );

      if (result.success && result.downloadUrl) {
        setStatus('completed');
        setDownloadUrl(result.downloadUrl);
        setProcessingTime(Date.now() - startTime);
        setProcessingMessage(
          processingMode === 'advanced' 
            ? 'Split-screen video created successfully!' 
            : 'Vertical video created successfully!'
        );
      } else {
        throw new Error(result.error || 'Processing failed');
      }

    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setProcessingMessage(`Error: ${errorMessage}`);
      console.error('Processing error:', error);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setStatus('idle');
    setDownloadUrl('');
    setProcessingMessage('');
    setUploadProgress(0);
    setProcessingTime(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Cloud className="h-6 w-6 text-blue-600" />
        <Video className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Cloudinary Video Processor</h2>
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
              Supports MP4, MOV, AVI up to 100MB • Powered by Cloudinary
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

          {/* Processing Mode Selection */}
          {selectedFile && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Choose Processing Mode</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="processingMode"
                    value="advanced"
                    checked={processingMode === 'advanced'}
                    onChange={(e) => setProcessingMode(e.target.value as ProcessingMode)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">🎮 Advanced Split-Screen</div>
                    <div className="text-sm text-gray-600">
                      Top: Your video | Bottom: Minecraft gameplay with AI subtitles
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      ✨ Powered by Cloudinary AI - No memory limits!
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="processingMode"
                    value="simple"
                    checked={processingMode === 'simple'}
                    onChange={(e) => setProcessingMode(e.target.value as ProcessingMode)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">📱 Simple Vertical</div>
                    <div className="text-sm text-gray-600">
                      Basic landscape to vertical conversion
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      ⚡ Fast Cloudinary transformation
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Process Button */}
          {selectedFile && (
            <button
              onClick={handleUploadAndProcess}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              {processingMode === 'advanced' ? '🎮 Create Split-Screen Video' : '📱 Convert to Vertical'}
            </button>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {status === 'uploading' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Cloud className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <p className="text-lg font-medium text-gray-900">{processingMessage}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Uploading to Cloudinary's global infrastructure...
          </p>
        </div>
      )}

      {/* Processing States */}
      {status === 'processing' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <p className="text-lg font-medium text-gray-900">{processingMessage}</p>
          </div>
          <p className="text-sm text-gray-600">
            {processingMode === 'advanced' 
              ? 'Cloudinary AI is creating your split-screen video with transcription...'
              : 'Cloudinary is optimizing your vertical video...'
            }
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
          <p className="text-sm text-blue-600 font-medium">
            ⚡ Processed in {(processingTime / 1000).toFixed(1)}s via Cloudinary
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {downloadUrl && (
              <a
                href={downloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5" />
                <span>Download from Cloudinary CDN</span>
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