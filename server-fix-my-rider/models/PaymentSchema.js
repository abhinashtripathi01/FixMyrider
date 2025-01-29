const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Payment", PaymentSchema);
