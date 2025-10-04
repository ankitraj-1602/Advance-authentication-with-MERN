const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many request attempt from this IP, try after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false
})

const forgotPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: {
        message: "Too many request attempt from this IP, try after 30 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {loginLimiter, forgotPasswordLimiter}