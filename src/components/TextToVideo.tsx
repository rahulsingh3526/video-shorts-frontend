import { useState } from 'react';
import { FileText, Sparkles, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

export default function TextToVideo() {
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [processingMessage, setProcessingMessage] = useState<string>('');

  const handleTextSubmit = async () => {
    if (!text.trim()) return;

    try {
      setStatus('processing');
      setProcessingMessage('Generating video from your text...');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://video-shorts-backend.onrender.com';
      console.log('API URL being used:', apiUrl); // Debug log
      
      const response = await fetch(`${apiUrl}/api/process-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const result = await response.json();
      
      if (result.success) {
        setStatus('completed');
        setDownloadUrl(result.downloadUrl);
        setProcessingMessage('Video generated successfully!');
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (error) {
      setStatus('error');
      setProcessingMessage('Something went wrong. Please try again.');
      console.error('Processing error:', error);
    }
  };

  const resetForm = () => {
    setText('');
    setStatus('idle');
    setDownloadUrl('');
    setProcessingMessage('');
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Text to Video</h2>
      </div>

      {status === 'idle' && (
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text or story
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your story, article, or any text you want to turn into a video. The AI will create engaging visuals and narration based on your content..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Recommended: 50-500 words for best results
              </p>
              <p className="text-xs text-gray-500">
                Words: {wordCount}
              </p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">Tips for better videos:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Write in a narrative or storytelling format</li>
              <li>• Include descriptive details and emotions</li>
              <li>• Keep paragraphs short for better pacing</li>
              <li>• Avoid excessive technical jargon</li>
            </ul>
          </div>

          {/* Generate Button */}
          {text.trim() && (
            <button
              onClick={handleTextSubmit}
              disabled={wordCount < 10}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Generate Video</span>
              </div>
            </button>
          )}

          {text.trim() && wordCount < 10 && (
            <p className="text-sm text-gray-500 text-center">
              Please enter at least 10 words to generate a video
            </p>
          )}
        </div>
      )}

      {/* Processing State */}
      {status === 'processing' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <p className="text-lg font-medium text-gray-900">{processingMessage}</p>
          </div>
          <p className="text-sm text-gray-600">
            This usually takes 3-7 minutes depending on text length
          </p>
        </div>
      )}

      {/* Completed State */}
      {status === 'completed' && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Video Generated!</h3>
          <p className="text-gray-600">Your text has been transformed into an engaging video.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="h-5 w-5" />
              <span>Download Video</span>
            </a>
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <FileText className="h-5 w-5" />
              <span>Create Another</span>
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
          <h3 className="text-xl font-semibold text-gray-900">Generation Failed</h3>
          <p className="text-gray-600">{processingMessage}</p>
          
          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <FileText className="h-5 w-5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
}