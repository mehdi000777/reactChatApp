import User from '../models/User.js';
import asyncHnadler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = asyncHnadler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: 'All fields are requierd' });

    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate) return res.status(400).json({ message: 'Duplicate username' });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        password: hashPassword
    })

    const accessToken = jwt.sign({ id: newUser._id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: newUser._id, username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    await newUser.save();

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 60 * 60 * 24 * 1000
    });

    res.status(201).json({
        message: 'Register success',
        accessToken,
        user: {
            ...newUser._doc,
            password: ''
        }
    })
})

export const login = asyncHnadler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: 'All fields are requierd' });

    const user = await User.findOne({ username }).lean().exec();
    if (!user) return res.status(401).json({ message: 'Username or password wrong.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Username or password wrong.' });

    const accessToken = jwt.sign({ id: user._id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id, username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 60 * 60 * 24 * 1000
    });

    res.status(200).json({
        message: 'Login success',
        accessToken,
        user: {
            ...user,
            password: ''
        }
    })
})

export const refresh = asyncHnadler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHnadler(async (err, decode) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        const user = await User.findById(decode.id, { password: false }).exec();
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        res.status(200).json({
            accessToken,
            user
        })
    }))
})

export const logout = asyncHnadler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ message: 'Logout success' })
})