const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount, currency = 'INR') {
    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await this.razorpay.orders.create(options);
      return { success: true, order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpaySignature;
    } catch (error) {
      return false;
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return { success: true, payment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PaymentService();