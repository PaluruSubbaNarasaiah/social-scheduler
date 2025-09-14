import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Crown, Check } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan) => {
    setLoading(true);
    try {
      const orderData = await paymentAPI.createOrder(plan);
      
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Simple Social Scheduler',
        description: `Upgrade to ${plan} plan`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan
            };
            
            await paymentAPI.verifyPayment(verifyData);
            toast.success('Payment successful! Plan upgraded.');
            window.location.reload();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: {
          color: '#3b82f6'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['5 posts per month', 'Basic analytics', 'Email support']
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 749,
      features: ['50 posts per month', 'AI caption generation', 'Advanced analytics', 'Priority support']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 1499,
      features: ['Unlimited posts', 'AI caption generation', 'Advanced analytics', 'Priority support', 'Team collaboration', 'Custom branding']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Plan</label>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-sm text-gray-900 capitalize">{user?.plan}</span>
                {user?.plan !== 'free' && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border-2 rounded-lg p-6 ${
                  user?.plan === plan.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {user?.plan === plan.id && (
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => plan.id !== 'free' && user?.plan !== plan.id && handleUpgrade(plan.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    user?.plan === plan.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.id === 'free'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                  disabled={user?.plan === plan.id || plan.id === 'free' || loading}
                >
                  {user?.plan === plan.id ? 'Current Plan' : plan.id === 'free' ? 'Free Plan' : loading ? 'Processing...' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is an MVP demo. Payment integration will be added in the full version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;