import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://video-shorts-backend.onrender.com';
    setUrl(apiUrl);
    
    try {
      setStatus('checking');
      const response = await fetch(`${apiUrl}/`);
      
      if (response.ok) {
        setStatus('online');
        setError('');
      } else {
        setStatus('offline');
        setError(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setStatus('offline');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking backend...';
      case 'online':
        return 'Backend is online';
      case 'offline':
        return 'Backend is offline';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <h3 className="font-medium text-gray-900">{getStatusText()}</h3>
          <p className="text-sm text-gray-600">API: {url}</p>
          {error && <p className="text-sm text-red-600">Error: {error}</p>}
        </div>
        <button
          onClick={checkBackendStatus}
          className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
