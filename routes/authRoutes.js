const express = require('express');
const { register, login, profile, refreshAccessToken, logout, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/refresh', refreshAccessToken)
authRouter.get('/profile', protect, profile)
authRouter.post('/logout', logout)
authRouter.get('/verify/:token',verifyEmail)
authRouter.post('/forgot-password',forgotPassword)
authRouter.post('/reset/:token',resetPassword)

module.exports = authRouter;
