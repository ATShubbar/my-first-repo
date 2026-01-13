import { ReactNode } from 'react';
import Link from 'next/link';
import { HiSparkles } from 'react-icons/hi';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center space-x-2 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <HiSparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">StyleAI</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} StyleAI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
