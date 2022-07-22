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
      required: [true, "Specify order Id"],
    },
    type: {
      type: String,
      enum: ["swap", "cash"],
      required: [true, "Order must have a type of swap or cash"],
    },
    swapProduct: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    status: {
      type: String,
      enum: ["previewed", "inprogress", "swapped", "purchased", "declined"],
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate("product").populate("buyer");

  next();
});
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });
