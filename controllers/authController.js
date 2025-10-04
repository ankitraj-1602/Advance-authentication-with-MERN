const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const generateRandomToken = require('../utils/generateRandomToken');
const sendMail = require('../utils/sendEmail');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = generateRandomToken();
        const verificationTokenExpiry = Date.now() + 1000 * 60 * 60;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry,
            role
        })

        const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

        await sendMail(email, 'Verify your email',
            `<h2>Welcome, ${name}</h2>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">${verificationLink}</a>`
        )

        res.status(201).json({ message: 'User created please verify your email' })

        // const accessToken = generateAccessToken(user._id);
        // const refreshToken = generateRefreshToken(user._id);

        // res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: false,
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // })

        // res.status(201).json({
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     accessToken
        // })

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

        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified' });
        }

        if(user.twoFA.enabled){
            return res.status(200).json({require2FA:true})
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
        res.status(500).json({ message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: false,
        })
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.send(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const resetToken = generateRandomToken();
        const resetTokenExpiry = Date.now() + 1000 * 60 * 60;

        const verificationLink = `http://localhost/api/auth/reset/${resetToken}`;

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        await sendMail(email, 'Reset your password',
            `<h3>Password Reset</h3>
                <p>Click the link below to reset your password:</p>
                <a href="${verificationLink}">${verificationLink}</a>
             `
        )

        res.status(200).json({ message: 'Reset link sent to email' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        })
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfull" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

const googleAuth = async (req, res) => {
    try {
        const payload = {
            _id: req.user._id
        }

        const accessToken = generateAccessToken(req.user._id);
        const refreshToken = generateRefreshToken(req.user._id)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: false,
            maxAge: 24 * 7 * 60 * 60 * 1000
        })

        res.json({ accessToken });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const twoFASetup = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).json({ message: "User not found" })
        const secret = speakeasy.generateSecret({
            name: `Advance MERN Authentication (${user.email})`
        })
        user.twoFA.secret = secret.base32;
        await user.save();
        const qrImage = await qrcode.toDataURL(secret.otpauth_url);
        res.json({
            message:'Scan qr code in Google Authenticator',
            qrImage,
            secret:secret.base32
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const twoFAVerify = async (req, res) => {
    try {
        const {token} =req.body;
        const user = await User.findById(req.user._id);
        if(!user || !user.twoFA.secret){
            return res.status(400).json({message:'2FA not setup'})
        }
        const verified = speakeasy.totp.verify({
            secret:user.twoFA.secret,
            encoding:'base32',
            token,
            window:1
        })
        if(!verified){
            return res.status(400).json({message:'Invalid token'})
        }
        user.twoFA.enabled=true;
        await user.save();
        res.json({message:'2FA has been enabled'})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

const twoFALogin = async (req, res) => {
    try {
        const { email, token} = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.twoFA.secret) {
            return res.status(400).json({ message: '2FA not setup' })
        }

        const verified = speakeasy.totp.verify({
            secret:user.twoFA.secret,
            encoding:'base32',
            token,
            window:1
        })
        
        if(!verified){
            return res.status(400).json({message:'Invalid 2FA code'})
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

module.exports = { 
    register, 
    login, 
    profile, 
    refreshAccessToken, 
    logout, 
    verifyEmail, 
    resetPassword, 
    forgotPassword, 
    googleAuth,
    twoFASetup,
    twoFAVerify,
    twoFALogin
 };