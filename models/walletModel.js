const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema(
  {
    balance: { type: Number, default: 0 },
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

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
