import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import root from './routes/root.js';
import mongoose from 'mongoose';
import connectDB from './config/connectDB.js';
import { logEvent, logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHnadler.js';
import corsOptions from './config/corsOptions.js';
import auth from './routes/auth.js';
import { WebSocketServer } from 'ws';
import { websocketHnadler } from './wss.js';
import message from './routes/message.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// connnect DB
connectDB();

// Middleware
app.use(logger);
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Routes
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', root);

// Api Routes
app.use('/auth', auth);
app.use('/messages', message);

// 404 Route
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('text').send('404 Not Found');
    }
})

// Error Handler
app.use(errorHandler)

// Listen
const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB')
    const server = app.listen(PORT, () => {
        console.log(`app run on http://localhost:${PORT}`);
    });
    const wss = new WebSocketServer({ server });
    websocketHnadler(wss);
})

mongoose.connection.on('error', (err) => {
    console.log(err);
    logEvent(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})