const mongoose = require("mongoose");
const chatImageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
    },
    publicId: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ChatImage = mongoose.model("ChatImage", chatImageSchema);

module.exports = ChatImage;
