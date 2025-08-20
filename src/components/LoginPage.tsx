import { usePrivy } from '@privy-io/react-auth';
import { Video, Wallet, Mail, Sparkles, Zap, Globe } from 'lucide-react';

export default function LoginPage() {
  const { login } = usePrivy();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Video className="h-16 w-16 text-blue-600" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900">VideoShorts</h2>
            <p className="mt-2 text-sm text-gray-600">
              Transform your videos and text into engaging short-form content
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Video className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-700">Convert videos to shorts format</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-700">Generate videos from text</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-gray-700">AI-powered processing</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Globe className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">Global crypto payments</span>
            </div>
          </div>

          {/* Login Options */}
          <div className="mt-8 space-y-4">
            <button
              onClick={() => login()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              Continue with Email
            </button>

            <button
              onClick={() => login()}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Wallet className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              </span>
              Connect Crypto Wallet
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}