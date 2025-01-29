const express = require("express");
const {
    allMessages,
    sendMessage,
} = require("../controllers/messageController");
const verifyJWT = require("../middleware/verifyJWT")

const router = express.Router();

router.route("/:chatId").get(verifyJWT, allMessages);
router.route("/").post(verifyJWT, sendMessage);

module.exports = router;