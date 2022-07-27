const mongoose = require("mongoose");
const coinTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    id: String,
    reference: {
      type: String,
      required: [true, "transaction must have a reference"],
    },
    senderAddress: String,
    recipientAddress: String,
    actualAmount: Number,
    amountPaid: Number,
    amountPaidFiat: Number,
    fiatAmount: Number,
    amountReceived: Number,
    amountReceivedFiat: Number,
    coin: {
      type: String,
      default: "USDT",
    },
    currency: {
      type: String,
      default: "NGN",
    },
    hash: String,
    blockNumber: Number,
    status: {
      type: String,
    },
    network: String,
    blockchain: String,
    merchantAddress: String,
    feeInCrypto: Number,
    fiatRate: Number,
    cryptoRate: Number,
  },
  {
    timestamps: true,
  }
);

const CoinTransaction = mongoose.model(
  "CoinTransaction",
  coinTransactionSchema
);

module.exports = CoinTransaction;
