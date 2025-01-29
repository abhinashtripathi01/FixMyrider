const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
//importing routes
const userRouter = require("./routes/users");
const mechanicRouter = require("./routes/mechanic");
const mechanicRequestRouter = require("./routes/mechanicRequest");
const reviewRouter = require("./routes/reviews");
const orderRouter = require("./routes/order");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const reportRouter = require("./routes/report");
const receiptRouter = require("./routes/receipt");
const paymentRouter = require("./routes/payment");

const bp = require("body-parser");

dotenv.config();

//middleware
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//connecting Mongoose
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Mongoose Connected");
  })
  .catch((error) => console.log(error));

//API
app.use("/api/user", userRouter);
app.use("/api/mechanic", mechanicRouter);
app.use("/api/mechanic-request", mechanicRequestRouter);
app.use("/api/review", reviewRouter);
app.use("/api/order", orderRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/report", reportRouter);
app.use("/api/receipt", receiptRouter);
app.use("/api/payment", paymentRouter);

const server = app.listen(8800, () => {
  console.log("server is up");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.userId);
    console.log(userData.userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("messageRecieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.userId);
  });
});
