const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro'],
    default: 'free'
  },
  planPrice: {
    type: Number,
    default: 0
  },
  socialAccounts: {
    instagram: { connected: Boolean, token: String },
    facebook: { connected: Boolean, token: String, facebookId: String },
    linkedin: { connected: Boolean, token: String },
    twitter: { connected: Boolean, token: String }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);