const mongoose = require("mongoose");
const payoutSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
      required: [true, "order Id for this payout is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount for this payout is required"],
    },
    fee: {
      type: Number,
      required: [true, "fee for this payout is required"],
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
