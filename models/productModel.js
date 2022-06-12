const mongoose = require("mongoose");
const slugify = require("slugify");
const productSchema = new mongoose.Schema(
  {
    about: String,
    status: String,
    name: String,
    category: String,
    price: Number,
    fault: String,
    expiryDate: Date,
    slug: String,
    isSold: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        publicId: String,
        original: String,
      },
    ],
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });
