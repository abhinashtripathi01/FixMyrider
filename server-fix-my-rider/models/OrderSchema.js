const mongoose = require("mongoose");

// const OrderItemSchema = new mongoose.Schema({
//   menuItemId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Menu",
//     required: true,
//   },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true },
// });

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: true,
    },
    // menuItems: [OrderItemSchema],
    vehicleType: { type: String, required: true },
    vehicleName: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    problemDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["Requested", "Confirmed", "Delivered", "Cancelled"],
      required: true,
      default: "Requested",
    },
    receipt: {
      type: Boolean,
      default: false,
    },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);
