const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A report must have the user being reported"],
    },
    buyerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A report must have the user being reported"],
    },
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
      required: [true, "A report must have the user being reported"],
    },
    message: {
      type: String,
      required: [true, "A report must have a message"],
    },
  },
  {
    timestamps: true,
  }
);

// reportSchema.pre(/^find/, function (next) {
//   this.populate("sellerId");
//   next();
// });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
