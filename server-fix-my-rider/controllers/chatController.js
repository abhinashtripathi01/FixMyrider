const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatSchema");
const User = require("../models/UserSchema");
const { Mechanic } = require("../models/MechanicSchema");

// To Create a Chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user.userId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [req.user.userId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Find all chats for the logged-in user
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.userId } },
    })
      .populate("users", "-password") // Populate users excluding password
      .populate("latestMessage") // Populate the latest message
      .sort({ updatedAt: -1 }); // Sort by most recently updated

    // Populate sender details in the latestMessage
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "username email role",
    });

    // Fetch mechanic data for all users with a mechanicId
    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const enrichedUsers = await Promise.all(
          chat.users.map(async (user) => {
            if (user.role === "seller" && user.mechanicId) {
              const mechanicData = await Mechanic.findOne({
                _id: user.mechanicId,
              }).select("name image rating address service"); // Select relevant fields
              return { ...user._doc, mechanicData }; // Include mechanic data in the user object
            }
            return user; // Return user as is if not a seller with a mechanicId
          })
        );
        return { ...chat._doc, users: enrichedUsers }; // Replace users with enriched users
      })
    );

    res.status(200).send(enrichedChats); // Send the enriched results
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = {
  accessChat,
  fetchChats,
};
