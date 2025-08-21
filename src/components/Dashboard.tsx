import { useState } from 'react';
import { Video, FileText, BarChart3, Clock, Download } from 'lucide-react';
import VideoUpload from './VideoUpload';
import TextToVideo from './TextToVideo';

type ActiveTab = 'video' | 'text' | 'history';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('video');

  const tabs = [
    {
      id: 'video' as ActiveTab,
      name: 'Video to Shorts',
      icon: Video,
      description: 'Memory-optimized split-screen with Minecraft background + subtitles',
    },
    {
      id: 'text' as ActiveTab,
      name: 'Text to Video',
      icon: FileText,
      description: 'Generate videos from your text content',
    },
    {
      id: 'history' as ActiveTab,
      name: 'History',
      icon: BarChart3,
      description: 'View your processed videos',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to VideoShorts!</h1>
        <p className="text-blue-100">
          Transform your content into engaging short-form videos with AI-powered processing.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none focus:text-blue-600 focus:border-blue-500 transition-colors`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'video' && <VideoUpload />}
          {activeTab === 'text' && <TextToVideo />}
          {activeTab === 'history' && <HistoryTab />}
        </div>
      </div>
    </div>
  );
}

// History Tab Component
function HistoryTab() {
  // Mock data - replace with real data later
  const processedVideos = [
    {
      id: 1,
      name: 'My Gaming Highlight.mp4',
      type: 'Video to Shorts',
      processedAt: '2024-01-15 14:30',
      status: 'completed',
      downloadUrl: '#',
    },
    {
      id: 2,
      name: 'Story About Innovation',
      type: 'Text to Video',
      processedAt: '2024-01-14 09:15',
      status: 'completed',
      downloadUrl: '#',
    },
    {
      id: 3,
      name: 'Tutorial Content.mov',
      type: 'Video to Shorts',
      processedAt: '2024-01-13 16:45',
      status: 'completed',
      downloadUrl: '#',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Processing History</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BarChart3 className="h-4 w-4" />
          <span>{processedVideos.length} videos processed</span>
        </div>
      </div>

      {processedVideos.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No videos processed yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by uploading a video or entering text to generate your first video.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processed At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedVideos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {video.type === 'Video to Shorts' ? (
                        <Video className="h-5 w-5 text-blue-600 mr-3" />
                      ) : (
                        <FileText className="h-5 w-5 text-purple-600 mr-3" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{video.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {video.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {video.processedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href={video.downloadUrl}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-900"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}