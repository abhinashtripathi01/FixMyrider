const mongoose = require("mongoose");

const MechanicRequestSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    coordinates: { latitude: Number, longitude: Number },
    userId: { type: String, required: true, unique: true },
    document1: { type: String, required: true },
    document2: { type: String },
    status: {
      type: String,
      enum: ["accepted", "flagged", "pending"],
      required: true,
      default: "pending",
    },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MechanicRequest", MechanicRequestSchema);
