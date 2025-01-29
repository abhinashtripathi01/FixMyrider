const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, required: true, max: 10 },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const MechanicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    coordinates: { latitude: Number, longitude: Number },
    phone: { type: String, required: false },
    numReviews: { type: Number, required: true },
    service: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    ],
    userId: { type: String },
    address: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

MechanicSchema.index({ coordinates: "2dsphere" });

module.exports = {
  Mechanic: mongoose.model("Mechanic", MechanicSchema),
  Service: mongoose.model("Service", serviceSchema),
};
