const mongoose = require("mongoose");

const coinWithdrawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    id: String,
    reference: {
      type: String,
    },
    senderAddress: String,
    recipientAddress: String,
    actualAmount: Number,
    amountPaid: Number,
    amountReceived: Number,
    coin: {
      type: String,
      default: "USDT",
    },
    hash: String,
    blockNumber: Number,
    type: String,
    status: {
      type: String,
    },
    network: String,
    blockchain: String,
    feeInCrypto: Number,
  },
  {
    timestamps: true,
  }
);

const CoinWithdraw = mongoose.model("CoinWithdraw", coinWithdrawSchema);

module.exports = CoinWithdraw;
