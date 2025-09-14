import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postsAPI, socialAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Instagram, Facebook, Linkedin, Twitter, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postData, setPostData] = useState({
    content: '',
    platforms: [],
    scheduledDate: '',
    imageUrl: ''
  });

  const { data: posts = [] } = useQuery('posts', postsAPI.getAll);

  const createPostMutation = useMutation(postsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      setShowCreatePost(false);
      setPostData({ content: '', platforms: [], scheduledDate: '', imageUrl: '' });
      toast.success('Post scheduled successfully!');
    }
  });

  const connectSocialMutation = useMutation(socialAPI.connect, {
    onSuccess: (_, platform) => toast.success(`${platform} connected!`)
  });

  const generateCaptionMutation = useMutation(
    ({ topic, tone }) => postsAPI.generateCaption(topic, tone),
    {
      onSuccess: (data) => {
        setPostData({ ...postData, content: data.caption });
        toast.success('Caption generated!');
      }
    }
  );

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' }
  ];

  const handleCreatePost = (e) => {
    e.preventDefault();
    createPostMutation.mutate(postData);
  };

  const togglePlatform = (platform) => {
    const platforms = postData.platforms.includes(platform)
      ? postData.platforms.filter(p => p !== platform)
      : [...postData.platforms, platform];
    setPostData({ ...postData, platforms });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={() => setShowCreatePost(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700"
        >
          <Plus size={20} />
          <span>Create Post</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Social Accounts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
          <div className="space-y-3">
            {socialPlatforms.map(({ id, name, icon: Icon, color }) => (
              <div key={id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`${color} w-5 h-5`} />
                  <span>{name}</span>
                </div>
                <button
                  onClick={() => connectSocialMutation.mutate(id)}
                  className={`px-3 py-1 rounded text-sm ${
                    user?.socialAccounts?.[id]?.connected
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {user?.socialAccounts?.[id]?.connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div key={post._id} className="border-l-4 border-primary-500 pl-4">
                <p className="font-medium">{post.content.substring(0, 100)}...</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>Platforms: {post.platforms.join(', ')}</span>
                  <span>Scheduled: {new Date(post.scheduledDate).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <div className="flex space-x-2">
                  <textarea
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    rows="4"
                    placeholder="What's on your mind?"
                    value={postData.content}
                    onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => generateCaptionMutation.mutate({ topic: 'business', tone: 'professional' })}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <Sparkles size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Platforms</label>
                <div className="flex space-x-4">
                  {socialPlatforms.map(({ id, name, icon: Icon, color }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => togglePlatform(id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                        postData.platforms.includes(id)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`${color} w-4 h-4`} />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={postData.scheduledDate}
                  onChange={(e) => setPostData({ ...postData, scheduledDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPostMutation.isLoading}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {createPostMutation.isLoading ? 'Scheduling...' : 'Schedule Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;