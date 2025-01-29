const router = require("express").Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const { Mechanic } = require("../models/MechanicSchema");
const Token = require("../models/tokenSchema");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const MechanicRequestSchema = require("../models/MechanicRequestSchema");
const UserSchema = require("../models/UserSchema");
//register
router.post("/register", async (req, res) => {
  try {
    const Registered = await User.findOne({ email: req.body.email });
    if (Registered) {
      res.json({ message: "User whith this email already Exists" });
    } else {
      // generate encrypted password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //creating new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: hashedPassword,
      });
      // saving the user in db and returing success
      const user = await newUser.save();
      res.status(200).json({ message: "User Registered!" });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    //Finding user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ message: "Invalid Credentials" });
    }

    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }
      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }

    if (user.role === "seller") {
      const mechanic = await Mechanic.findOne({ userId: user._id });
      if (mechanic?.isBlocked !== true) {
        //send response
        if (validPassword) {
          const token = jwt.sign(
            {
              name: user.username,
              email: user.email,
              role: user.role,
              mechanicId: user.mechanicId,
              userId: user._id,
            },
            process.env.ACCESS_TOKEN_SECRET
          );

          return res.json({
            status: "ok",
            user: token,
            username: user.username,
            userId: user._id,
            role: user.role,
            mechanicId: user.mechanicId,
          });
        } else {
          return res.json({ message: "Invalid Credentials" });
        }
      } else {
        return res.json({ message: "Your Account is Blocked!" });
      }
    } else {
      if (validPassword) {
        const token = jwt.sign(
          {
            name: user.username,
            email: user.email,
            role: user.role,
            userId: user._id,
          },
          process.env.ACCESS_TOKEN_SECRET
        );

        return res.json({
          status: "ok",
          user: token,
          username: user.username,
          userId: user._id,
          role: user.role,
        });
      } else {
        return res.json({ message: "Invalid Credentials" });
      }
    }
  } catch (error) {
    return res.json({
      status: "Somthing went wrong",
      user: false,
      error: error.message,
    });
  }
});

// get user details

router.get("/user", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "seller") {
      const mechanic = await Mechanic.findOne({ userId: user._id });
      res.status(200).json({
        name: user.name,
        email: user.email,
        role: user.role,
        mechanicId: user.mechanicId,
        userId: user._id,
        phone: user.phone,
        address: user.address,
        username: user.username,
        mechanicName: mechanic.name,
        image: user.image,
      });
    } else {
      res.status(200).json({
        name: user.name,
        email: user.email,
        role: user.role,
        mechanicId: user.mechanicId,
        userId: user._id,
        phone: user.phone,
        address: user.address,
        username: user.username,
        image: user.image,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user's name, address, and phone number
router.put("/update", verifyJWT, async (req, res) => {
  try {
    const { username, address, phone, image } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, address, phone, image },
      { new: true }
    );
    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error?.message || "Server Error", success: false });
  }
});

// Get overall stats - total sellers, total customers, total seller requests, total users
router.get("/stats", verifyJWT, async (req, res) => {
  try {
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalSellerRequests = await MechanicRequestSchema.countDocuments({
      status: "pending",
    });
    const totalUsers = await User.countDocuments({});

    res.json({
      totalSellers,
      totalCustomers,
      totalSellerRequests,
      totalUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get overall stats" });
  }
});

router.get("/:id/verify/:token/", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    user.verified = true;
    await user.save();
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    // If user not found, send error message
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Generate a unique JWT token for the user that contains the user's id
    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });
    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
    <p>Click on the following link to reset your password:</p>
    <a href="${process.env.FRONTEND_LINK}/reset-password/${token}">${process.env.FRONTEND_LINK}/reset-password/${token}</a>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: err.message, success: false });
      }
      res
        .status(200)
        .send({ message: "Email Sent Successfully.", success: true });
    });
  } catch (err) {
    res.status(500).send({ message: err.message, success: false });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    // Verify the token sent by the user
    const decodedToken = jwt.verify(
      req.query.token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token", success: false });
    }

    // find the user with the id from the token
    const user = await UserSchema.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).send({ message: "no user found", success: false });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // Update user's password, clear reset token and expiration time
    user.password = req.body.password;
    await user.save();

    // Send success response
    res.status(200).send({ message: "Password updated", success: true });
  } catch (err) {
    // Send error response if any error occurs
    res.status(500).send({ message: err.message, success: false });
  }
});

module.exports = router;
