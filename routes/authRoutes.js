const express = require('express');
const { register, login, profile, refreshAccessToken, logout } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/refresh', refreshAccessToken)
authRouter.get('/profile', protect, profile)
authRouter.post('/logout', logout)

module.exports = authRouter;
