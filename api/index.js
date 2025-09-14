const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data storage (replace with MongoDB later)
let users = [];
let posts = [];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Simple Social Scheduler API', status: 'running', timestamp: new Date().toISOString() });
});

// Auth routes (simplified for testing)
app.post('/auth/register', (req, res) => {
  try {
    const { name, email, password, plan = 'free' } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash this
      plan,
      createdAt: new Date()
    };
    
    users.push(user);
    
    const token = 'mock-token-' + user.id;
    res.status(201).json({ 
      token, 
      user: { id: user.id, name, email, plan },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = 'mock-token-' + user.id;
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Posts routes (simplified)
app.get('/posts', (req, res) => {
  res.json({ posts: [], message: 'Posts endpoint working' });
});

app.post('/posts', (req, res) => {
  const post = { id: Date.now(), ...req.body, createdAt: new Date() };
  posts.push(post);
  res.status(201).json({ post, message: 'Post created successfully' });
});

app.post('/posts/generate-caption', (req, res) => {
  const { topic = 'business', tone = 'professional' } = req.body;
  const mockCaptions = [
    `🚀 Exciting ${topic} update! Stay tuned for more. #${topic} #business #growth`,
    `💡 ${tone} insights on ${topic}. What are your thoughts? #${topic} #innovation`,
    `🎯 ${topic} made simple. Follow for more tips! #${topic} #tips #success`
  ];
  const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)];
  res.json({ caption: randomCaption });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;