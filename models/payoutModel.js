const mongoose = require("mongoose");
const payoutSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
    amount: {
      type: Number,
    },
    transfer: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      enum: [3, 5, 7],
      default: 3,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payout = mongoose.model("Payout", payoutSchema);

module.exports = Payout;
