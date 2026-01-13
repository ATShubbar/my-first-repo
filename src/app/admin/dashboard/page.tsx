'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiUsers, HiColorSwatch, HiSparkles, HiPhotograph, HiTrendingUp } from 'react-icons/hi';
import { collection, query, getDocs, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, Spinner, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/utils/helpers';

interface DashboardStats {
  totalUsers: number;
  totalStyles: number;
  totalGenerations: number;
  generationsToday: number;
  recentGenerations: Array<{
    id: string;
    styleName: string;
    createdAt: Date;
    userId: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Fetch total styles
      const stylesSnapshot = await getDocs(collection(db, 'styles'));
      const totalStyles = stylesSnapshot.size;

      // Fetch total generations
      const generationsSnapshot = await getDocs(collection(db, 'generations'));
      const totalGenerations = generationsSnapshot.size;

      // Fetch generations today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const generationsTodayQuery = query(
        collection(db, 'generations'),
        where('createdAt', '>=', Timestamp.fromDate(today))
      );
      const generationsTodaySnapshot = await getDocs(generationsTodayQuery);
      const generationsToday = generationsTodaySnapshot.size;

      // Fetch recent generations
      const recentGenerationsQuery = query(
        collection(db, 'generations'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentGenerationsSnapshot = await getDocs(recentGenerationsQuery);
      const recentGenerations = recentGenerationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        styleName: doc.data().styleName,
        userId: doc.data().userId,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      setStats({
        totalUsers,
        totalStyles,
        totalGenerations,
        generationsToday,
        recentGenerations,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: HiUsers,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/users',
    },
    {
      label: 'Total Styles',
      value: stats?.totalStyles || 0,
      icon: HiColorSwatch,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/styles',
    },
    {
      label: 'Total Generations',
      value: stats?.totalGenerations || 0,
      icon: HiSparkles,
      color: 'from-pink-500 to-pink-600',
      href: '/admin/analytics',
    },
    {
      label: 'Generations Today',
      value: stats?.generationsToday || 0,
      icon: HiTrendingUp,
      color: 'from-green-500 to-green-600',
      href: '/admin/analytics',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the StyleAI admin panel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Generations
            </h2>
            <Link
              href="/admin/analytics"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentGenerations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No generations yet
              </p>
            ) : (
              stats?.recentGenerations.map((generation) => (
                <div
                  key={generation.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <HiPhotograph className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {generation.styleName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(generation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="purple">New</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/styles"
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiColorSwatch className="w-8 h-8 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Manage Styles</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add, edit, or remove styles
              </p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiUsers className="w-8 h-8 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and manage users
              </p>
            </Link>
            <Link
              href="/admin/categories"
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiSparkles className="w-8 h-8 text-pink-600 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Categories</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Organize your styles
              </p>
            </Link>
            <Link
              href="/admin/analytics"
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HiTrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View usage statistics
              </p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
