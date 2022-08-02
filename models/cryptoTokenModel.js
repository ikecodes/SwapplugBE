const mongoose = require("mongoose");
const cryptoTokenSchema = new mongoose.Schema(
  {
    balance: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["USDT", "BUSD", "DAI", "USDC"],
      required: [true, "Token wallet must have a type"],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CryptoToken = mongoose.model("CryptoToken", cryptoTokenSchema);

module.exports = CryptoToken;
