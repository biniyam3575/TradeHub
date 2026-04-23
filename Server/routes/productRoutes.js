const express = require('express');
const router = express.Router();
const { getProducts, addProduct, receiveStock } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/add', addProduct);
router.post('/stock-update', receiveStock);

module.exports = router;