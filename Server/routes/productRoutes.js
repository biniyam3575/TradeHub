const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { getProducts, addProduct } = require('../controllers/productController');

// 'image' is the name of the field we will send from Postman/Frontend
router.post('/add', upload.single('image'), addProduct);
router.get('/', getProducts);

module.exports = router;




