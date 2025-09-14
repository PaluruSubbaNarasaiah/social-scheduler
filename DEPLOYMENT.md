# Deployment Guide

## Backend Deployment (Railway)

1. **Create Railway Account:** https://railway.app
2. **Deploy from GitHub:**
   ```bash
   # Connect your GitHub repo
   # Select backend folder as root directory
   ```
3. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://socialscheduler:SocialScheduler@social.vlwczph.mongodb.net/?retryWrites=true&w=majority&appName=social
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=dzd1gynl3
   CLOUDINARY_API_KEY=596239849549863
   CLOUDINARY_API_SECRET=bNxiVuiLymJ5OGmc9DSK8Sze_hk
   OPENAI_API_KEY=your-openai-key
   FACEBOOK_APP_ID=1459990601717326
   FACEBOOK_APP_SECRET=your-facebook-secret
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   NODE_ENV=production
   ```

## Frontend Deployment (Vercel)

1. **Already configured** with vercel.json
2. **Add Environment Variable in Vercel:**
   ```
   VITE_API_URL=https://your-railway-backend-url.com/api
   ```

## Quick Deploy Steps:

### 1. Deploy Backend to Railway:
- Go to railway.app
- Connect GitHub repo
- Set root directory to `backend`
- Add all environment variables
- Deploy

### 2. Update Frontend:
- Copy your Railway backend URL
- In Vercel dashboard, add environment variable:
  `VITE_API_URL=https://your-backend-url.railway.app/api`
- Redeploy frontend

### 3. Test:
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.railway.app/api

## Alternative Backend Hosts:
- **Render:** render.com (free tier)
- **Fly.io:** fly.io (free tier)
- **Heroku:** heroku.com (paid)