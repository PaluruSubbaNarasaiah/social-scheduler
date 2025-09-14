import React from 'react';
import { useQuery } from 'react-query';
import { postsAPI } from '../services/api';
import { BarChart3, TrendingUp, Users, Heart } from 'lucide-react';

const Analytics = () => {
  const { data: analytics = [] } = useQuery('analytics', postsAPI.getAnalytics);

  const totalMetrics = analytics.reduce(
    (acc, post) => ({
      likes: acc.likes + (post.analytics?.likes || 0),
      comments: acc.comments + (post.analytics?.comments || 0),
      shares: acc.shares + (post.analytics?.shares || 0),
      clicks: acc.clicks + (post.analytics?.clicks || 0)
    }),
    { likes: 0, comments: 0, shares: 0, clicks: 0 }
  );

  const metricCards = [
    { title: 'Total Likes', value: totalMetrics.likes, icon: Heart, color: 'text-red-500' },
    { title: 'Comments', value: totalMetrics.comments, icon: Users, color: 'text-blue-500' },
    { title: 'Shares', value: totalMetrics.shares, icon: TrendingUp, color: 'text-green-500' },
    { title: 'Clicks', value: totalMetrics.clicks, icon: BarChart3, color: 'text-purple-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your social media performance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
              </div>
              <Icon className={`${color} w-8 h-8`} />
            </div>
          </div>
        ))}
      </div>

      {/* Post Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Post Performance</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.slice(0, 10).map((post) => (
              <div key={post._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-medium text-gray-900">{post.content.substring(0, 80)}...</p>
                  <span className="text-sm text-gray-500">
                    {new Date(post.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-6 text-sm">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{post.analytics?.likes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{post.analytics?.comments || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>{post.analytics?.shares || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span>{post.analytics?.clicks || 0}</span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    Platforms: {post.platforms.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;