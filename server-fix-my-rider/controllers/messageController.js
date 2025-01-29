const asyncHandler = require("express-async-handler");
const Message = require("../models/messageSchema");
const User = require("../models/UserSchema");
const Chat = require("../models/ChatSchema");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "username email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user.userId,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await Message.populate(message, {
            path: "sender",
            select: "username",
        });
        message = await Message.populate(message, {
            path: "chat",
            populate: {
                path: "users",
                select: "username email",
            },
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = { allMessages, sendMessage };