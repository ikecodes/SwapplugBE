const crypto = require("crypto");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const createAndSendToken = require("../helpers/createAndSendToken");
const Mail = require("../helpers/sendEmail");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function getAllUsers
   * @route /api/v1/users
   * @method GET
   */
  getAllUsers: catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
    });
  }),
  /**
   * @function user
   * @route /api/v1/users/getUser
   * @method GET
   */
  getUser: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(new AppError("Please login to gain access", 403));

    const followsYou = user.following.includes(req.user._id);
    const youFollow = user.followers.includes(req.user._id);
    const stats = await Product.aggregate([
      {
        $match: { seller: req.params.id },
      },
      {
        $group: {
          _id: "$seller",
          numberOfProducts: { $sum: 1 },
          numberOfRatings: { $sum: "$ratingsQuantity" },
          averageRating: { $avg: "$ratingsAverage" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        ...user._doc,
        stats,
        followsYou,
        youFollow,
      },
    });
  }),

  /**
   * @function getUserStats
   * @route /api/v1/users/getUserStats
   * @method GET
   */
  getUserStats: catchAsync(async (req, res, next) => {
    const stats = await Product.aggregate([
      {
        $match: { seller: req.user._id },
      },
      {
        $group: {
          _id: "$seller",
          numberOfProducts: { $sum: 1 },
          numberOfRatings: { $sum: "$ratingsQuantity" },
          averageRating: { $avg: "$ratingsAverage" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  }),

  /**
   * @function followUser
   * @route /api/v1/users/followUser
   * @method PATCH
   */

  followUser: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("No user found with this Id", 404));

    if (user._id.toString() === req.user._id.toString())
      return next(new AppError("You cannot follow yourself", 404));

    const alreadyFollowing = user.followers.includes(req.user._id);
    if (alreadyFollowing)
      return res.status(200).json({
        status: "success",
        message: "You are already following this user",
      });
    user.followers.push(req.user._id);
    user.save();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.params.id },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),
  /**
   * @function unfollowUser
   * @route /api/v1/users/unfollowUser
   * @method PATCH
   */

  unfollowUser: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("No user found with this Id", 404));

    const following = user.followers.includes(req.user._id);
    if (!following)
      return res.status(200).json({
        status: "success",
        message: "You do not follow this user",
      });
    user.followers.pull(req.user._id);
    user.save();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.params.id },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),

  /**
   * @function deactivateUser
   * @route /api/v1/users/deactivateUser
   * @method PATCH
   */

  /**
   * @function verifyUser
   * @route /api/v1/users/verifyUser
   * @method PATCH
   */

  verifyUser: catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),
  /**
   * @function activeStatus
   * @route /api/v1/users/activeStatus
   * @method PATCH
   */
  activeStatus: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id });
    if (user.active === true) {
      user.active = false;
    } else {
      user.active = true;
    }
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  }),
  /**
   * @function deactivateMe
   * @route /api/v1/users/deactivateMe
   * @method PATCH
   */
  deactivateMe: catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(200).json({
      status: "success",
    });
  }),
};
