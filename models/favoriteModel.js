const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.pre(/^find/, function (next) {
  this.populate("product");
  next();
});
const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
