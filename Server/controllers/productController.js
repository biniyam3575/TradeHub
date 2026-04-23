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
    const productData = req.body;
    
    // If a file was uploaded, save the URL path
    if (req.file) {
      productData.image_url = `/uploads/${req.file.filename}`;
    }

    const productId = await Product.create(productData);
    res.status(201).json({ message: 'Product added with image', productId });
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