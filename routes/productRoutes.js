const express = require('express');
const protect = require('../middleware/authMiddleware');
const permitPermission = require('../middleware/permissionMiddleware');
const { viewProduct, createProduct } = require('../controllers/productController');
const router = express.Router();

router.get("/view",protect,permitPermission(["read:products"]),viewProduct);
router.post("/create",protect, permitPermission(["create:products"]),createProduct);

module.exports = router