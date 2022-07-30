const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    to: {
      type: String,
      default: "user",
    },
    type: {
      type: String,
      enum: ["order", "payout", "product"],
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
    payoutId: {
      type: mongoose.Schema.ObjectId,
      ref: "Payout",
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
