const jwt = require('jsonwebtoken');

// const generateToken = (userId) =>{
//     return jwt.sign({_id:userId},process.env.JWT_SECRET,{
//         expiresIn:'15m'
//     })
// }

const generateAccessToken = (userId, role) => {
    return jwt.sign({ _id: userId, role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

const generateRefreshToken = (userId, role) => {
    return jwt.sign({ _id: userId, role }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

module.exports = { generateAccessToken, generateRefreshToken };