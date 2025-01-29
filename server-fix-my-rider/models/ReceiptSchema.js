const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    serviceCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    items: [
      {
        item: String,
        quantity: Number,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Receipt", ReceiptSchema);
