const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
    type: {
      type: String,
      enum: ["text", "image"],
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
