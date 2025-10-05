const express = require('express');
const updateAssignedRole = require('../controllers/roleController');
const protect = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const router = express.Router();

router.patch('/users/:id/role', protect, permit('admin'), updateAssignedRole)

module.exports = router;