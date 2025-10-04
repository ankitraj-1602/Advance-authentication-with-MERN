const express = require('express');
const { register, login, profile, refreshAccessToken, logout, verifyEmail, forgotPassword, resetPassword, googleAuth, twoFASetup, twoFAVerify, twoFALogin } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { loginLimiter, forgotPasswordLimiter } = require('../middleware/rateLimiter');
const passport = require('passport');
const authRouter = express.Router();
const jwt = require('jsonwebtoken')
require('../config/passport');

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
authRouter.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleAuth)

authRouter.post('/register', register);
authRouter.post('/login', loginLimiter, login);
authRouter.get('/refresh', refreshAccessToken)
authRouter.post('/logout', logout)
authRouter.get('/verify/:token', verifyEmail)
authRouter.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
authRouter.post('/reset/:token', resetPassword)

authRouter.get('/profile', protect, profile)

authRouter.post('/2fa/setup', protect, twoFASetup);
authRouter.post('/2fa/verify', protect, twoFAVerify)
authRouter.post('/2fa/login', twoFALogin)


module.exports = authRouter;
