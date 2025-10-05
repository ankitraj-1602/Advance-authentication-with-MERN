const User = require('../models/User');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log(token)
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = await User.findById(decoded._id).select('-password').populate('role')
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' })
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization failed' })
    }
}

module.exports = protect;