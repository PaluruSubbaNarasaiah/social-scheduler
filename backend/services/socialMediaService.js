const axios = require('axios');
const { TwitterApi } = require('twitter-api-v2');

class SocialMediaService {
  
  async postToFacebook(accessToken, message, imageUrl = null) {
    try {
      const url = `https://graph.facebook.com/me/feed`;
      const data = {
        message,
        access_token: accessToken
      };
      
      if (imageUrl) {
        data.link = imageUrl;
      }
      
      const response = await axios.post(url, data);
      return { success: true, postId: response.data.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async postToInstagram(accessToken, message, imageUrl) {
    try {
      if (!imageUrl) {
        throw new Error('Instagram requires an image');
      }

      const containerUrl = `https://graph.facebook.com/v18.0/{instagram-account-id}/media`;
      const containerData = {
        image_url: imageUrl,
        caption: message,
        access_token: accessToken
      };
      
      const containerResponse = await axios.post(containerUrl, containerData);
      const creationId = containerResponse.data.id;
      
      const publishUrl = `https://graph.facebook.com/v18.0/{instagram-account-id}/media_publish`;
      const publishData = {
        creation_id: creationId,
        access_token: accessToken
      };
      
      const publishResponse = await axios.post(publishUrl, publishData);
      return { success: true, postId: publishResponse.data.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async postToTwitter(accessToken, accessTokenSecret, message, imageUrl = null) {
    try {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken,
        accessSecret: accessTokenSecret,
      });

      const tweetData = { text: message };
      const tweet = await client.v2.tweet(tweetData);
      return { success: true, postId: tweet.data.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async postToLinkedIn(accessToken, message, imageUrl = null) {
    try {
      const profileResponse = await axios.get('https://api.linkedin.com/v2/people/~', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const personUrn = profileResponse.data.id;
      
      const postData = {
        author: `urn:li:person:${personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: message
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, postId: response.data.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async postToSocialMedia(platform, tokens, content, imageUrl = null) {
    switch (platform) {
      case 'facebook':
        return await this.postToFacebook(tokens.accessToken, content, imageUrl);
      case 'instagram':
        return await this.postToInstagram(tokens.accessToken, content, imageUrl);
      case 'twitter':
        return await this.postToTwitter(tokens.accessToken, tokens.accessTokenSecret, content, imageUrl);
      case 'linkedin':
        return await this.postToLinkedIn(tokens.accessToken, content, imageUrl);
      default:
        return { success: false, error: 'Unsupported platform' };
    }
  }
}

module.exports = new SocialMediaService();