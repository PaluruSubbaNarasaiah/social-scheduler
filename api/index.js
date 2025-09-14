const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.use('/auth', require('../backend/routes/auth'));
app.use('/posts', require('../backend/routes/posts'));
app.use('/payment', require('../backend/routes/payment'));
app.use('/data-delete', require('../backend/routes/dataDelete'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Simple Social Scheduler API', status: 'running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;