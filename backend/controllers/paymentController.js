const paymentService = require('../services/paymentService');
const User = require('../models/User');

const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const planPrices = { basic: 749, pro: 1499 };
    
    if (!planPrices[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const amount = planPrices[plan];
    const result = await paymentService.createOrder(amount);

    if (result.success) {
      res.json({
        orderId: result.order.id,
        amount: result.order.amount,
        currency: result.order.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan 
    } = req.body;

    const isValid = paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      // Update user plan
      const user = await User.findById(req.user._id);
      const planPrices = { basic: 749, pro: 1499 };
      
      user.plan = plan;
      user.planPrice = planPrices[plan];
      await user.save();

      res.json({ 
        success: true, 
        message: 'Payment verified and plan updated',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          planPrice: user.planPrice
        }
      });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    // Mock payment history for now
    const history = [
      {
        id: 'pay_123',
        amount: 749,
        plan: 'basic',
        date: new Date(),
        status: 'success'
      }
    ];
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory
};