import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'free'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const plans = [
    { id: 'free', name: 'Free', price: 0, features: ['5 posts/month', 'Basic analytics'] },
    { id: 'basic', name: 'Basic', price: 749, features: ['50 posts/month', 'AI captions', 'Analytics'] },
    { id: 'pro', name: 'Pro', price: 1499, features: ['Unlimited posts', 'AI captions', 'Advanced analytics', 'Priority support'] }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.plan);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">sign in to existing account</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <div key={plan.id} className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              formData.plan === plan.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            }`} onClick={() => setFormData({...formData, plan: plan.id})}>
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="text-2xl font-bold">₹{plan.price}<span className="text-sm font-normal">/month</span></p>
              <ul className="text-sm text-gray-600 mt-2">
                {plan.features.map((feature, i) => <li key={i}>• {feature}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;