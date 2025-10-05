const express = require('express');
const { createRole, getAllRole, addPermissionToRole, removePermissionFromRole, assignRoleToUser, updateAssignedRole } = require('../controllers/roleController');
const protect = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/create',protect,permit('admin'),createRole)
router.get('/all',protect,permit('admin'),getAllRole)
router.post('/:roleId/permissions',protect,permit('admin'),addPermissionToRole)
router.delete("/:roleId/permission",protect,permit('admin'),removePermissionFromRole)
router.post('/assign/:userId',protect,permit('admin'),assignRoleToUser)

router.patch('/users/:id/role', protect, permit('admin'), updateAssignedRole)

module.exports = router;