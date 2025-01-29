const express = require("express");
const router = express.Router();
const Order = require("../models/OrderSchema.js");
// const Cart = require("../models/CartSchema.js");
const verifyJWT = require("../middleware/verifyJWT.js");
const { Mechanic } = require("../models/MechanicSchema.js");
const { default: mongoose } = require("mongoose");

// Create a new order
router.post("/", async (req, res) => {
  const {
    userId,
    mechanicId,
    vehicleName,
    vehicleModel,
    vehicleType,
    problemDescription,
  } = req.body;

  // Validate required fields
  if (
    !userId ||
    !mechanicId ||
    !vehicleName ||
    !vehicleModel ||
    !vehicleType ||
    !problemDescription
  ) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });
  }

  // Validate ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(mechanicId)
  ) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid userId or mechanicId" });
  }

  try {
    // Create new order
    const order = new Order({
      userId,
      mechanicId,
      vehicleName,
      vehicleModel,
      vehicleType,
      problemDescription,
    });

    // Save order to the database
    const savedOrder = await order.save();

    // Return the saved order with a 201 status code
    return res.status(201).json({ success: true, savedOrder });
  } catch (error) {
    console.error("Error creating order:", error.message);
    return res.status(500).send("Server Error");
  }
});

// Get orders for a specific user
router.get("/", verifyJWT, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate({
        path: "mechanicId",
        select: "name image address type rating userId",
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get orders for a specific
router.get("/mechanic/:mechanicId", async (req, res) => {
  try {
    const orders = await Order.find({
      mechanicId: req.params.mechanicId,
      status: { $ne: "Cancelled" }, // Filter out cancelled orders
    })
      .populate({
        path: "mechanicId",
        select: "name address rating",
      })
      .populate({
        path: "userId",
        select: "username _id image",
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Change Status
router.put("/status/:orderId", verifyJWT, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const userId = req.user.userId;

  try {
    // Fetch the order and populate the mechanic's userId
    const order = await Order.findById(orderId).populate("mechanicId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the mechanic exists and is associated with the order
    const mechanic = order.mechanicId;
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    // Check if the logged-in user is authorized to update the status
    if (
      mechanic.userId.toString() !== userId &&
      order.userId.toString() !== userId
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Update the status of the order
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({ message: "Status Updated", updatedOrder });
  } catch (err) {
    console.error("Error updating order status:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
