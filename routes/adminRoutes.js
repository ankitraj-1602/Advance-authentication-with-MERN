const express = require('express');
const { adminDashboard } = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/dashboard', protect, permit('admin'), adminDashboard)

module.exports = router;