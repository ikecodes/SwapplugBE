const mongoose = require("mongoose");
const withdrawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    transactionId: {
      type: Number,
      required: [true, "transaction is required"],
      trim: true,
    },
    accountNumber: {
      type: Number,
      required: [true, "account number is required"],
      trim: true,
    },
    bankCode: {
      type: Number,
      required: [true, "bank code is required"],
      trim: true,
    },
    bankName: {
      required: [true, "bank name is required"],
      type: String,
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
      default: "NGN",
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    transactionStatus: {
      type: String,
    },
    transactionDate: {
      type: String,
    },
    reference: {
      required: [true, "reference is required"],
      type: String,
    },
    narration: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

module.exports = Withdraw;
