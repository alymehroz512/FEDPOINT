const express = require('express');
const { authMiddleware, adminAuth } = require('../middleware/auth');
const { getStats, getTrends } = require('../controllers/analyticsController');

const router = express.Router();

router.use(authMiddleware, adminAuth);

router.get('/stats', getStats);
router.get('/trends', getTrends);

module.exports = router;