const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    accountType: {
      type: String,
      enum: ["personal", "business"],
    },
    bankName: {
      type: String,
      required: [true, "Please tell us your bank name"],
    },
    bankCode: {
      type: Number,
      required: [true, "Please tell us your bank code"],
    },
    accountName: {
      type: String,
      required: [true, "Please provide your account name"],
    },
    accountNumber: {
      type: Number,
      required: [true, "Please provide your account number"],
    },
    currency: {
      type: String,
      default: "NGN",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Bank = mongoose.model("Bank", bankSchema);

module.exports = Bank;
