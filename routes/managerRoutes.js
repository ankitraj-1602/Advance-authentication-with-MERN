const express = require('express');
const { managerDashboard } = require('../controllers/managerController');
const protect = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/dashboard',protect,permit('admin','manager'),managerDashboard)

module.exports = router;