const express = require('express');
const { createOrder, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

module.exports = router;