const express = require('express');
const { authMiddleware, adminAuth } = require('../middleware/auth');
const { createBrand, getBrands } = require('../controllers/brandController');

const router = express.Router();

router.use(authMiddleware, adminAuth);

router.post('/', createBrand);
router.get('/', getBrands);

module.exports = router;