const express = require('express');
const { authMiddleware, adminAuth } = require('../middleware/auth');
const { createCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

router.use(authMiddleware, adminAuth);

router.post('/', createCategory);
router.get('/', getCategories);

module.exports = router;