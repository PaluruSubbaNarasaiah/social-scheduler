import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password, plan) => {
    const response = await api.post('/auth/register', { name, email, password, plan });
    return response.data;
  }
};

export const postsAPI = {
  create: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/posts');
    return response.data;
  },
  update: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  generateCaption: async (topic, tone) => {
    const response = await api.post('/posts/generate-caption', { topic, tone });
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/posts/analytics');
    return response.data;
  }
};

export const socialAPI = {
  connect: async (platform) => {
    const response = await api.post('/social/connect', { platform });
    return response.data;
  }
};

export const paymentAPI = {
  createOrder: async (plan) => {
    const response = await api.post('/payment/create-order', { plan });
    return response.data;
  },
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  }
};

export default api;