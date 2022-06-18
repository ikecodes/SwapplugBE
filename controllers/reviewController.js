const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const calcAverageRatings = async function (productId) {
  const stats = await Review.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  // console.log(stats);
  // if (stats.length > 0) {
  //   await Product.findByIdAndUpdate(productId, {
  //     ratingsQuantity: stats[0].nRating,
  //     ratingsAverage: stats[0].avgRating,
  //   });
  // } else {
  //   await Product.findByIdAndUpdate(productId, {
  //     ratingsQuantity: 0,
  //     ratingsAverage: 4.5,
  //   });
  // }
};
module.exports = {
  /**
   * @function getAllReviews
   * @route /api/v1/reviews
   * @method GET
   */
  getAllReviews: catchAsync(async (req, res, next) => {
    const reviews = await Review.find({
      product: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: reviews,
    });
  }),
  //   /**
  //    * @function getReview
  //    * @route /api/v1/reviews
  //    * @method GET
  //    */
  //   getReview: catchAsync(async (req, res, next) => {
  //     const review = await Review.findOne({
  //       user: req.user.id,
  //       product: req.params.id,
  //     });
  //     res.status(200).json({
  //       status: "success",
  //       data: review,
  //     });
  //   }),
  /**
   * @function createReview
   * @route /api/v1/reviews
   * @method POST
   */
  createReview: catchAsync(async (req, res, next) => {
    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      product: req.body.productId,
    });
    if (alreadyReviewed)
      return next(new AppError("Product already reviewed by you", 403));

    const newReview = await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      user: req.user.id,
      product: req.body.productId,
    });

    res.status(200).json({
      status: "success",
      data: newReview,
    });
  }),
  /**
   * @function deleteReview
   * @route /api/v1/reviews
   * @method DELETE
   */
  deleteReview: catchAsync(async (req, res, next) => {
    await Review.findOneAndDelete({
      user: req.user.id,
      product: req.params.id,
    });
    res.status(204).json({
      status: "success",
    });
  }),
};
