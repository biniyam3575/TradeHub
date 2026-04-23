const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    // Only 'admin' or 'seller' should be able to do this (we will add middleware later)
    const productId = await Product.create(req.body);
    res.status(201).json({ message: 'Product added successfully', productId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

exports.receiveStock = async (req, res) => {
  try {
    const { productId, warehouseId, quantity } = req.body;
    await Product.updateStock(productId, warehouseId, quantity);
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};