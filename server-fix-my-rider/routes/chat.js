const router = require('express').Router();
const {
    accessChat,
    fetchChats,
} = require("../controllers/chatController");
const verifyJWT = require("../middleware/verifyJWT")


router.route("/").post(verifyJWT, accessChat)
router.route("/").get(verifyJWT, fetchChats)

module.exports = router;