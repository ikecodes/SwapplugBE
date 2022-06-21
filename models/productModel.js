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
    availableForTb: {
      type: Boolean,
      default: false,
    },
    ratingsQuantity: Number,
    ratingsAverage: {
      type: Number,
      default: 0,
    },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  virtural populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre("save", async function (next) {
  this.slug = slugify(this.name, { lower: true });
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "seller",
    select: "-__v -passwordChangedAt",
  });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// tourSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "guides",
//     select: "-__v -passwordChangedAt",
//   });

//   next();
// });
