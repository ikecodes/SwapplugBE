const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    deviceType: {
      type: String,
      enum: ["android", "ios"],
    },
    fcmToken: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
