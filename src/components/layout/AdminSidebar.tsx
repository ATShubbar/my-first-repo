'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiHome,
  HiSparkles,
  HiColorSwatch,
  HiUsers,
  HiChartBar,
  HiCog,
  HiArrowLeft,
} from 'react-icons/hi';
import { clsx } from 'clsx';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: HiHome },
  { href: '/admin/styles', label: 'Styles', icon: HiColorSwatch },
  { href: '/admin/categories', label: 'Categories', icon: HiSparkles },
  { href: '/admin/users', label: 'Users', icon: HiUsers },
  { href: '/admin/analytics', label: 'Analytics', icon: HiChartBar },
  { href: '/admin/settings', label: 'Settings', icon: HiCog },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <HiSparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">StyleAI Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <HiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Site</span>
        </Link>
      </div>
    </aside>
  );
}
