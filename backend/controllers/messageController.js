import Message from "../models/Message.js";
import User from '../models/User.js';
import asyncHandler from "express-async-handler";


export const createMessage = asyncHandler(async (req, res) => {
    const { text, sender, recipient } = req.body;

    if (!text, !sender, !recipient) return res.status(400).json({ message: 'All fields are required' });

    const newMessage = new Message({
        sender,
        recipient,
        text
    });

    await newMessage.save();

    res.status(201).json({ newMessage });
})

export const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    console.log(userId)

    const messages = await Message.find({
        $or: [
            { sender: req.user, recipient: userId },
            { sender: userId, recipient: req.user }
        ]
    }).sort({ createdAt: 1 }).lean().exec();
    res.status(200).json({ messages });
})

export const getPeople = asyncHandler(async (req, res) => {
    const users = await User.find({}, { password: false }).lean();

    res.status(200).json({ users });
})