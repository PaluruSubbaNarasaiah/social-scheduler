const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const router = express.Router();

// Facebook Data Deletion Callback
router.post('/facebook-delete', async (req, res) => {
  try {
    const { signed_request } = req.body;
    
    if (!signed_request) {
      return res.status(400).json({ error: 'Missing signed_request' });
    }

    // Parse Facebook signed request
    const [encodedSig, payload] = signed_request.split('.');
    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    const userId = data.user_id;
    
    // Find user by Facebook ID and delete all data
    const user = await User.findOne({ 'socialAccounts.facebook.facebookId': userId });
    
    if (user) {
      // Delete all user posts
      await Post.deleteMany({ userId: user._id });
      
      // Remove Facebook connection
      user.socialAccounts.facebook = { connected: false, token: null };
      await user.save();
      
      console.log(`Data deleted for Facebook user: ${userId}`);
    }

    // Facebook expects this response format
    res.json({
      url: `${process.env.FRONTEND_URL}/data-deletion-status?id=${userId}`,
      confirmation_code: `DEL_${userId}_${Date.now()}`
    });
    
  } catch (error) {
    console.error('Facebook data deletion error:', error);
    res.status(500).json({ error: 'Data deletion failed' });
  }
});

// Manual data deletion endpoint
router.delete('/user-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Delete all user posts
    await Post.deleteMany({ userId });
    
    // Delete user account
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'All user data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Data deletion failed' });
  }
});

module.exports = router;