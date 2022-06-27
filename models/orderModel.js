const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Specify seller Id"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Specify buyer Id"],
    },
    type: {
      type: String,
      enum: ["barter", "cash"],
      default: "cash",
    },
    barterProduct: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    status: {
      type: String,
      enum: [
        "previewed",
        "confirmed",
        "meet-up",
        "bartered",
        "purchased",
        "cancelled",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });
