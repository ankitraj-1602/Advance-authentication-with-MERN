const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis')
const { createClient } = require('redis')
const dotenv = require('dotenv');
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on('error', (err) => {
    console.log(err)
})

redisClient.connect().catch(console.err);

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many request attempt from this IP, try after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })
})

const forgotPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: {
        message: "Too many request attempt from this IP, try after 30 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })

})

module.exports = { loginLimiter, forgotPasswordLimiter }