import express from 'express';
import { sendMessage, getConversations, getMessages, markMessageAsSeen, viewMessage } from '../controllers/messageController.js';
import { isAuthenticatedUser } from '../middlewares/authUser.js';

const router = express.Router();

router.use(isAuthenticatedUser);

router.get('/conversations', getConversations);
router.get('/messages/:userId', getMessages);
router.post('/message', sendMessage);
router.post('/viewmessage', viewMessage);
router.put('/message/:messageId/seen', markMessageAsSeen);

export default router;
