'use client';

import { useState } from 'react';
import { HiCog, HiKey, HiCloud, HiShieldCheck } from 'react-icons/hi';
import { Card, Input, Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Settings saved!');
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your StyleAI application.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* API Configuration */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
              <HiKey className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Configuration
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure your Google Gemini API settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                API keys are configured via environment variables for security. Update your{' '}
                <code className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 rounded">
                  .env.local
                </code>{' '}
                file to change these settings.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gemini API Key Status
              </label>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Configured via environment variable
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Firebase Configuration */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600/20 to-red-600/20 flex items-center justify-center">
              <HiCloud className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Firebase Configuration
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your Firebase project settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project ID
              </label>
              <Input
                value={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not configured'}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auth Domain
              </label>
              <Input
                value={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not configured'}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Storage Bucket
              </label>
              <Input
                value={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Not configured'}
                disabled
              />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600/20 to-teal-600/20 flex items-center justify-center">
              <HiShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Application security configuration
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Firebase Security Rules
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configured in Firebase Console
                </p>
              </div>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Open Console
              </a>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  CORS Configuration
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Managed via Google Cloud Console
                </p>
              </div>
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Open Console
              </a>
            </div>
          </div>
        </Card>

        {/* General Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center">
              <HiCog className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                General Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Basic application settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Application Name"
              defaultValue="StyleAI"
              placeholder="Your app name"
            />

            <Input
              label="Application URL"
              defaultValue={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
              placeholder="https://yourdomain.com"
            />

            <Input
              label="Max Upload Size (MB)"
              type="number"
              defaultValue="5"
              min="1"
              max="20"
            />
          </div>

          <div className="mt-6">
            <Button onClick={handleSave} isLoading={isLoading}>
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
