const Post = require('../models/Post');
let openai = null;

try {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.log('OpenAI not configured');
}

const createPost = async (req, res) => {
  try {
    const { content, platforms, scheduledDate, imageUrl } = req.body;
    
    const post = await Post.create({
      userId: req.user._id,
      content,
      platforms,
      scheduledDate: new Date(scheduledDate),
      imageUrl
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id }).sort({ scheduledDate: 1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateCaption = async (req, res) => {
  try {
    const { topic, tone = 'professional' } = req.body;
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key') {
      // Mock response for testing
      const mockCaptions = [
        `🚀 Exciting ${topic} update! Stay tuned for more. #${topic} #business #growth`,
        `💡 ${tone} insights on ${topic}. What are your thoughts? #${topic} #innovation`,
        `🎯 ${topic} made simple. Follow for more tips! #${topic} #tips #success`
      ];
      const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)];
      return res.json({ caption: randomCaption });
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Generate a ${tone} social media caption about ${topic}. Include relevant hashtags. Keep it under 280 characters.`
      }],
      max_tokens: 150
    });

    res.json({ caption: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: 'AI service unavailable' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id, status: 'published' });
    
    // Mock analytics data
    const analytics = posts.map(post => ({
      ...post.toObject(),
      analytics: {
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 20) + 2,
        shares: Math.floor(Math.random() * 15) + 1,
        clicks: Math.floor(Math.random() * 50) + 5
      }
    }));

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  generateCaption,
  getAnalytics
};