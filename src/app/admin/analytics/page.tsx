'use client';

import { useState, useEffect } from 'react';
import { HiTrendingUp, HiPhotograph, HiUsers, HiCalendar } from 'react-icons/hi';
import { collection, query, getDocs, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, Spinner } from '@/components/ui';
import { formatDate } from '@/utils/helpers';

interface AnalyticsData {
  generationsToday: number;
  generationsThisWeek: number;
  generationsThisMonth: number;
  totalGenerations: number;
  activeUsersToday: number;
  topStyles: Array<{ name: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: string;
    styleName?: string;
    createdAt: Date;
  }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Fetch all generations
      const generationsSnapshot = await getDocs(collection(db, 'generations'));
      const generations = generationsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: data.userId as string,
          styleName: data.styleName as string,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });

      // Calculate stats
      const generationsToday = generations.filter(
        (g) => g.createdAt >= today
      ).length;
      const generationsThisWeek = generations.filter(
        (g) => g.createdAt >= weekAgo
      ).length;
      const generationsThisMonth = generations.filter(
        (g) => g.createdAt >= monthAgo
      ).length;

      // Count unique users today
      const uniqueUsersToday = new Set(
        generations
          .filter((g) => g.createdAt >= today)
          .map((g) => g.userId)
      ).size;

      // Top styles
      const styleCounts: Record<string, number> = {};
      generations.forEach((g) => {
        const name = g.styleName || 'Unknown';
        styleCounts[name] = (styleCounts[name] || 0) + 1;
      });
      const topStyles = Object.entries(styleCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent activity
      const recentActivity = generations
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10)
        .map((g, index) => ({
          id: `gen-${index}`,
          type: 'generation',
          styleName: g.styleName,
          createdAt: g.createdAt,
        }));

      setData({
        generationsToday,
        generationsThisWeek,
        generationsThisMonth,
        totalGenerations: generations.length,
        activeUsersToday: uniqueUsersToday,
        topStyles,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const statsCards = [
    {
      label: 'Generations Today',
      value: data?.generationsToday || 0,
      icon: HiPhotograph,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'This Week',
      value: data?.generationsThisWeek || 0,
      icon: HiCalendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'This Month',
      value: data?.generationsThisMonth || 0,
      icon: HiTrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Active Users Today',
      value: data?.activeUsersToday || 0,
      icon: HiUsers,
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track usage statistics and trends.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <Card key={stat.label}>
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Styles */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Styles
          </h2>
          {data?.topStyles.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No data yet
            </p>
          ) : (
            <div className="space-y-4">
              {data?.topStyles.map((style, index) => (
                <div key={style.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <span className="font-bold text-purple-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {style.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {style.count} generations
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                        style={{
                          width: `${(style.count / (data?.topStyles[0]?.count || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          {data?.recentActivity.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No activity yet
            </p>
          ) : (
            <div className="space-y-4">
              {data?.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-800 last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                    <HiPhotograph className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      New generation: {activity.styleName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Total Stats */}
      <Card className="mt-6">
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Total Generations
          </p>
          <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {data?.totalGenerations.toLocaleString() || 0}
          </p>
        </div>
      </Card>
    </div>
  );
}
