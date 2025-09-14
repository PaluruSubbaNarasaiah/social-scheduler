# Simple Social Media Post Scheduler

A full-stack MVP SaaS application for scheduling and managing social media posts across multiple platforms.

## 🚀 Features

- **User Authentication** - JWT-based login/register
- **Social Account Integration** - Mock OAuth for Instagram, Facebook, LinkedIn, Twitter
- **Post Scheduling** - Calendar view with drag-and-drop
- **AI Caption Generation** - OpenAI integration for content creation
- **Analytics Dashboard** - Mock engagement metrics
- **Subscription Plans** - Indian pricing (₹749/₹1499)

## 🛠 Tech Stack

**Frontend:**
- React 18 + Vite
- TailwindCSS
- React Query
- FullCalendar.js
- React Router DOM

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Node-cron for scheduling
- OpenAI API integration

## 📦 Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and API keys
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Environment Variables

Create `.env` in backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-scheduler
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
```

## 💰 Pricing Plans (Indian Market)

- **Free**: ₹0/month - 5 posts, basic analytics
- **Basic**: ₹749/month - 50 posts, AI captions, analytics
- **Pro**: ₹1499/month - Unlimited posts, advanced features

## 🚀 Deployment

**Frontend**: Deploy to Vercel/Netlify
**Backend**: Deploy to Render/Railway/Fly.io
**Database**: MongoDB Atlas

## 📱 User Flow

1. Register/Login with email
2. Connect social accounts (mock OAuth)
3. Create posts with AI-generated captions
4. Schedule posts on calendar
5. View analytics and engagement metrics

## 🔮 Future Enhancements

- Real social media API integrations
- Stripe payment processing
- Image upload with Cloudinary
- Team collaboration features
- Advanced analytics with charts

## 📄 License

MIT License - feel free to use for learning and commercial projects!