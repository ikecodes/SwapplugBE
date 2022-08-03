const mongoose = require("mongoose");
const coinWalletSchema = new mongoose.Schema(
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

const CoinWallet = mongoose.model("CoinWallet", coinWalletSchema);

module.exports = CoinWallet;
