const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mechanicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    reportType: { type: String, required: true },
    reportDescription: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Report", ReportSchema);
