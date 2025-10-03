const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid User' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' })
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const profile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'No refresh token' });
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded._id);
        if (!user) return res.status(401).json({ message: 'User not found' });
        const accessToken = generateAccessToken(user._id);
        res.json({ accessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
}

const logout = async (req,res) => {
    try {
        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure:false,
            sameSite:false,
        })
        res.status(200).json({message:'Logged out successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

module.exports = { register, login, profile, refreshAccessToken, logout };