const express = require('express');
const { authMiddleware, adminAuth } = require('../middleware/auth');
const { addProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.use(authMiddleware, adminAuth); // All product routes require admin auth

router.post('/', addProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;