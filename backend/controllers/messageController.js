import mongoose from 'mongoose';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import Message from "../models/messageModel.js"
import { ErrorHandler } from '../utils/ErrorHandler.js';
import User from "../models/userModel.js"

const getUpdatedConversations = async (userId) => {
    const conversations = await Message.aggregate([
        {
            $match: {
                $or: [{ sender: new mongoose.Types.ObjectId(userId) }, { recipient: new mongoose.Types.ObjectId(userId) }]
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                        '$recipient',
                        '$sender'
                    ]
                },
                lastMessage: { $first: '$$ROOT' },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$recipient', new mongoose.Types.ObjectId(userId)] },
                                    { $eq: ['$seen', false] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'otherUser'
            }
        },
        {
            $unwind: '$otherUser'
        },
        {
            $match: {
                'otherUser._id': { $ne: new mongoose.Types.ObjectId(userId) }
            }
        },
        {
            $project: {
                _id: 1,
                lastMessage: {
                    _id: '$lastMessage._id',
                    content: '$lastMessage.content',
                    seen: '$lastMessage.seen',
                    sender: '$lastMessage.sender',
                    recipient: '$lastMessage.recipient',
                    createdAt: '$lastMessage.createdAt'
                },
                unreadCount: 1,
                otherUser: {
                    _id: '$otherUser._id',
                    fullname: '$otherUser.personal_info.fullname',
                    username: '$otherUser.personal_info.username',
                    profile_img: '$otherUser.personal_info.profile_img'
                }
            }
        },
        {
            $sort: { 'lastMessage.createdAt': -1 }
        }
    ]);

    return conversations;
};


export const getConversations = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const conversations = await getUpdatedConversations(userId);

    res.status(200).json({
        success: true,
        conversations
    });
});




export const getMessages = catchAsyncErrors(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
        $or: [{ sender: currentUserId, recipient: userId }, { sender: userId, recipient: currentUserId }]
    }).sort({ createdAt: -1 }).limit(50);

    const userFound = await User.findById(userId)

    if (!userFound) {
        next(new ErrorHandler('User not found', 404))
    }

    const messagesChat = messages.reverse()
    const user = userFound.personal_info

    res.status(200).json({
        messagesChat,
        user
    });
});

export const sendMessage = catchAsyncErrors(async (req, res) => {
    const { recipientId, content } = req.body;
    const senderId = req.user._id;

    const message = await Message.create({
        sender: senderId,
        recipient: recipientId,
        content
    });

    req.io.to(senderId.toString()).to(recipientId).emit("newMessage", message)

    const senderConversations = await getUpdatedConversations(senderId)
    req.io.to(senderId.toString()).emit('updateConversations', senderConversations)

    const recipientConversations = await getUpdatedConversations(recipientId);
    req.io.to(recipientId).emit('updateConversations', recipientConversations);


    res.status(201).json(message);
});

export const markMessageAsSeen = catchAsyncErrors(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(messageId, { seen: true }, { new: true });

    if (!message) throw new ErrorHandler('Message not found', 404);

    res.status(200).json(message);
});



export const viewMessage = catchAsyncErrors(async (req, res, next) => {
    const { conversationId } = req.body;
    const currentUserId = req.user._id;

    // Mark all unseen messages in this conversation as seen
    await Message.updateMany(
        { 
            recipient: currentUserId, 
            sender: conversationId,
            seen: false 
        },
        { $set: { seen: true } }
    ); 

    res.status(200).json({ success: true, message: 'Messages marked as seen' });
});