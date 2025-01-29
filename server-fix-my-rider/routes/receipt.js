const express = require("express");
const ReceiptSchema = require("../models/ReceiptSchema");
const OrderSchema = require("../models/OrderSchema");
const router = express.Router();

// Add a new receipt
router.post("/", async (req, res) => {
  try {
    const { orderId, serviceCharge, totalAmount, items } = req.body;

    // Validate required fields
    if (
      !orderId ||
      serviceCharge === undefined ||
      totalAmount === 0 ||
      !items
    ) {
      return res.status(400).json({ message: "Invalid data!", success: false });
    }

    // Check if the order exists
    const order = await OrderSchema.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    // Check if a receipt already exists for this orderId and delete it
    const existingReceipt = await ReceiptSchema.findOne({ orderId });
    if (existingReceipt) {
      await ReceiptSchema.findByIdAndDelete(existingReceipt._id);
    }

    // Create a new receipt
    const newReceipt = new ReceiptSchema({
      orderId,
      serviceCharge,
      totalAmount,
      items,
    });
    const savedReceipt = await newReceipt.save();

    // Update the order's receipt field to true
    order.receipt = true;
    await order.save();

    res.status(201).json({
      message: "Receipt added successfully",
      receipt: savedReceipt,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding receipt", error, success: false });
    console.log(error);
  }
});

// Get receipt by orderId
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const receipt = await ReceiptSchema.findOne({ orderId });
    if (!receipt) {
      return res
        .status(404)
        .json({ success: false, message: "Receipt not found" });
    }

    res.status(200).json({ success: true, receipt });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error retrieving receipt", error });
  }
});

// Delete receipt by orderId
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedReceipt = await Receipt.findOneAndDelete({ orderId });
    if (!deletedReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json({
      message: "Receipt deleted successfully",
      receipt: deletedReceipt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting receipt", error });
  }
});

module.exports = router;
