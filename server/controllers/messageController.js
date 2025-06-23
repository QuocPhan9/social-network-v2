import { messageModel, conversationModel, HttpError } from "../models/index.js";
import { getReceiverSocketId } from "../socket/socket.js";

//===== Create Message =====//
const createMessage = async (req, res, next) => {
    try {
        const senderId = req.user.id;
        const { receiverId } = req.params;
        const { messageBody } = req.body;

        if (!messageBody?.trim()) {
            return next(new HttpError("Message body is required", 400));
        }

        const lastMessage = { text: messageBody, senderId };

        const conversation =
            (await conversationModel.findOneAndUpdate(
                { participants: { $all: [senderId, receiverId] } },
                { $set: { lastMessage } },
                { new: true }
            )) ||
            (await conversationModel.create({
                participants: [senderId, receiverId],
                lastMessage,
            }));
       
        const message = await messageModel.create({
            conversationId: conversation._id,
            senderId,
            text: messageBody,
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        res.status(201).json(message);
    } catch (err) {
        next(new HttpError(err.message || "Internal Server Error", 500));
    }
};

//===== Get Messages =====//
const getMessages = async (req, res, next) => {
    try {
        const { receiverId } = req.params;
        const conversation = await conversationModel.findOne({
            participants: { $all: [req.user.id, receiverId] },
        });
        if (!conversation) {
            return next(new HttpError("Conversation not found", 404));
        }
        const messages = await messageModel
            .find({
                conversationId: conversation._id,
            })
            .sort({ createAt: 1 });

        res.json(messages);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Conversations =====//
const getConversations = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const conversations = await conversationModel
            .find({ participants: userId })
            .populate({
                path: "participants",
                select: "fullName profilePhoto",
                match: { _id: { $ne: userId } }, // lọc luôn từ DB
            })
            .sort({ createdAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        next(new HttpError(error.message || "Something went wrong", 500));
    }
};
export { createMessage, getMessages, getConversations };
