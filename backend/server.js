require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/database');
const Post = require('./models/Post');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/data-delete', require('./routes/dataDelete'));

// Serve static files for privacy policy and data deletion
app.use(express.static('public'));

// Mock social account connection
app.post('/api/social/connect', require('./middleware/auth'), async (req, res) => {
  try {
    const { platform } = req.body;
    const user = req.user;
    
    // Mock OAuth connection
    user.socialAccounts[platform] = {
      connected: true,
      token: `mock_token_${platform}_${Date.now()}`
    };
    
    await user.save();
    res.json({ message: `${platform} connected successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cron job for real social media posting (runs every minute)
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const postsToPublish = await Post.find({
      scheduledDate: { $lte: now },
      status: 'scheduled'
    }).populate('userId');

    for (const post of postsToPublish) {
      console.log(`📱 Publishing post: "${post.content}" to ${post.platforms.join(', ')}`);
      
      // Real social media posting
      const socialMediaService = require('./services/socialMediaService');
      let publishedCount = 0;
      
      for (const platform of post.platforms) {
        const tokens = post.userId.socialAccounts[platform];
        if (tokens && tokens.connected) {
          try {
            const result = await socialMediaService.postToSocialMedia(
              platform, 
              tokens, 
              post.content, 
              post.imageUrl
            );
            if (result.success) {
              publishedCount++;
              console.log(`✅ Posted to ${platform}: ${result.postId}`);
            } else {
              console.error(`❌ Failed to post to ${platform}: ${result.error}`);
            }
          } catch (error) {
            console.error(`❌ Error posting to ${platform}:`, error.message);
          }
        }
      }
      
      post.status = publishedCount > 0 ? 'published' : 'failed';
      await post.save();
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;