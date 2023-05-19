import express from 'express';
import { getMessages, getPeople } from '../controllers/messageController.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/users', getPeople);
router.get('/:userId', getMessages);

export default router;