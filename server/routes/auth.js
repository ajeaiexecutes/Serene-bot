import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { Otp } from '../models/Otp.js';
import { sendOtpEmail } from '../utils/emailService.js';
import { configDotenv } from 'dotenv';

configDotenv();

export const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1. Sign Up
router.post('/signup', async (req, res) => {
    try {
        console.log("signup");
        const { email, password, name } = req.body;
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ error: 'User already exists and is verified' });
        }

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ email, password: hashedPassword, name, authProvider: 'local' });
            await user.save();
        } else {
            user.password = await bcrypt.hash(password, 10);
            user.name = name;
            await user.save();
        }

        await Otp.deleteMany({ email, type: 'verification' });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await new Otp({ email, otp, type: 'verification', expiresAt }).save();

        await sendOtpEmail(email, otp, 'verification');

        res.json({ message: 'OTP sent to email. Please verify.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp, type } = req.body;
        const otpRecord = await Otp.findOne({ email, type, otp });

        if (!otpRecord) return res.status(400).json({ error: 'Invalid OTP' });
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        if (type === 'verification') {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ error: 'User not found' });
            user.isVerified = true;
            await user.save();
            await Otp.deleteMany({ email, type: 'verification' });

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
        } else if (type === 'reset') {
            return res.json({ message: 'OTP verified', email });
        }
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email first' });
        if (user.authProvider !== 'local') return res.status(400).json({ error: 'Use Google to log in' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.authProvider !== 'local') {
            return res.status(404).json({ error: 'Email not valid for password reset' });
        }

        await Otp.deleteMany({ email, type: 'reset' });
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await new Otp({ email, otp, type: 'reset', expiresAt }).save();

        await sendOtpEmail(email, otp, 'reset');
        res.json({ message: 'Reset OTP sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const otpRecord = await Otp.findOne({ email, type: 'reset', otp });

        if (!otpRecord) return res.status(400).json({ error: 'Invalid OTP' });
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        const user = await User.findOne({ email });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await Otp.deleteMany({ email, type: 'reset' });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 6. Google OAuth
router.post('/google', async (req, res) => {
    try {
        const { credential, isMock, email: mockEmail, name: mockName } = req.body;

        if (isMock) {
            let user = await User.findOne({ email: mockEmail });
            if (!user) {
                user = new User({ email: mockEmail, name: mockName, isVerified: true, authProvider: 'google', oauthId: 'mock-id' });
                await user.save();
            }
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name, isVerified: true, authProvider: 'google', oauthId: googleId });
            await user.save();
        } else if (user.authProvider === 'local') {
            user.authProvider = 'google';
            user.oauthId = googleId;
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email, name: user.name } });
    } catch (error) {
        console.error('Google OAuth error', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
