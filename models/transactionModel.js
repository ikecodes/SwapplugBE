const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    transactionId: {
      type: Number,
      trim: true,
    },
    // name: {
    //   type: String,
    //   required: [true, "name is required"],
    //   trim: true,
    // },
    // email: {
    //   type: String,
    //   required: [true, "email is required"],
    //   trim: true,
    // },
    // phone: {
    //   type: String,
    // },
    // amount: {
    //   type: Number,
    //   required: [true, "amount is required"],
    // },
    currency: {
      type: String,
      required: [true, "currency is required"],
      enum: ["NGN", "USD", "EUR", "GBP"],
      default: "NGN",
    },
    paymentStatus: {
      type: String,
      enum: ["successful", "pending", "failed"],
      default: "pending",
    },
    paymentGateway: {
      type: String,
      required: [true, "payment gateway is required"],
      enum: ["flutterwave"], // Payment gateway might differs as the application grows
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
