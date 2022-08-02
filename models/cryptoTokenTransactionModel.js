const mongoose = require("mongoose");

const cryptoTokenTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    acceptPartialPayment: Boolean,
    actualAmount: Number,
    amountPaid: Number,
    amountPaidFiat: Number,
    amountReceived: Number,
    amountReceivedFiat: Number,
    blockNumber: Number,
    blockchain: String,
    coin: {
      type: String,
      default: "USDT",
    },
    currency: {
      type: String,
      default: "NGN",
    },
    feeInCrypto: Number,
    fiatAmount: Number,
    hash: String,
    id: String,
    network: String,
    recipientAddress: String,
    reference: {
      type: String,
      required: [true, "transaction must have a reference"],
    },
    senderAddress: String,
    status: {
      type: String,
    },
    type: String,
    // merchantAddress: String,
    fiatRate: Number,
    cryptoRate: Number,
  },
  {
    timestamps: true,
  }
);

const CryptoTokenTransaction = mongoose.model(
  "CryptoTokenTransaction",
  cryptoTokenTransactionSchema
);

module.exports = CryptoTokenTransaction;
