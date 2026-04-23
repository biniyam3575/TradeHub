const Order = require('../models/orderModel');

exports.placeOrder = async (req, res) => {
  try {
    const orderId = await Order.createOrder(req.body);
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    res.status(400).json({ message: 'Order failed', error: error.message });
  }
};