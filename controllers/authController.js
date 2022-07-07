const crypto = require("crypto");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Wallet = require("../models/walletModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const createAndSendToken = require("../helpers/createAndSendToken");
const Mail = require("../helpers/sendEmail");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function signup
   * @route /api/v1/users/signup
   * @method POST
   */
  signup: catchAsync(async (req, res, next) => {
    const { email, phone } = req.body;
    const existingUserWithEmail = await User.findOne({ email: email });
    if (existingUserWithEmail)
      return next(new AppError("User with email already exists", 401));
    const existingUserWithPhone = await User.findOne({ phone: phone });
    if (existingUserWithPhone)
      return next(new AppError("User with phone number already exists", 401));

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      password: req.body.password,
      gender: req.body.gender,
    });

    // create wallet for new user
    await Wallet.create({ userId: newUser._id });

    const token = newUser.createEmailConfirmToken();
    await newUser.save({ validateBeforeSave: false });
    const options = {
      mail: newUser.email,
      subject: "Welcome to Trade By Barter!",
      email: "../email/welcome.ejs",
      firtname: newUser.firstName,
      token: token,
    };

    try {
      await Mail(options);
      res.status(200).json({
        status: "success",
        message:
          "signup successful, email verification token sent to your mail",
        data: newUser,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  }),

  /**
   * @function reSendEmail
   * @route /api/v1/users/sendEmail
   * @method POST
   */
  reSendEmail: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }
    const token = user.createEmailConfirmToken();
    await user.save({ validateBeforeSave: false });
    const options = {
      mail: user.email,
      subject: "Welcome to Spid Realty!",
      email: "../email/welcome.ejs",
      firtname: user.firstName,
      token: token,
    };
    try {
      await Mail(options);

      res.status(200).json({
        status: "success",
        message: "token sent to mail",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  }),

  /**
   * @function confirmEmail
   * @route /api/v1/users/confirmEmail
   * @method POST
   */
  confirmEmail: catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      emailConfirmToken: req.body.token,
      email: req.body.email,
    });
    if (!user) {
      return next(new AppError("token is invalid or has expired", 400));
    }
    user.emailConfirmToken = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Token confirmation successful, you can now login",
    });
  }),

  /**
   * @function login
   * @route /api/v1/users/session
   * @method POST
   */
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("please provide email and password!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (user.emailConfirmToken)
      return next(new AppError("please verify your email address", 401));

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError("incorrect email or password!", 401));

    createAndSendToken(user, 200, res);
  }),
  /**
   * @function me
   * @route /api/v1/users/getMe
   * @method GET
   */
  getMe: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return next(new AppError("Please login to gain access", 403));

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
        ...user._doc,
        stats,
      },
    });
  }),
  /**
   * @function getWallet
   * @route /api/v1/users/getWallet
   * @method GET
   */
  getWallet: catchAsync(async (req, res, next) => {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) return next(new AppError("Please login to gain access", 403));

    res.status(200).json({
      status: "success",
      data: wallet,
    });
  }),

  /**
   * @function forgotPassword
   * @route /api/v1/users/forgotPassword
   * @method POST
   */
  forgotPassword: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const options = {
      mail: user.email,
      subject: "Password Reset",
      email: "../email/forgotPassword.ejs",
      firtname: user.firstname,
      token: resetToken,
    };
    try {
      await Mail(options);
      res.status(200).json({
        status: "success",
        message: "Password reset token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError("There was an error sending the email. Try again later!"),
        500
      );
    }
  }),

  /**
   * @function passwordResetConfirm
   * @route /api/v1/users/passwordResetConfirm
   * @method POST
   */
  passwordResetConfirm: catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      email: req.body.email,
      passwordResetToken: req.body.token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new AppError("token is invalid or has expired", 400));
    }
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Token confirmation successful, you can now reset passsword",
    });
  }),

  /**
   * @function resetPassword
   * @route /api/v1/users/resetPassword
   * @method PATCH
   */
  resetPassword: catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      email: req.body.email,
    });

    user.password = req.body.password;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "password reset successful",
    });
  }),

  /**
   * @function updateMe
   * @route /api/v1/users/updateMe
   * @method PATCH
   */
  updateMe: catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      next(
        new AppError(
          "this route is not for password update, please /updateMyPassword",
          400
        )
      );
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),

  /**
   * @function updatePhoto
   * @route /api/v1/users/updatePhoto
   * @method PATCH
   */
  updatePhoto: catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      next(new AppError("this route is not for password update", 400));
    }
    if (req.user.photoPublicId)
      await cloudinary.uploader.destroy(req.user.photoPublicId);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      null,
      {
        folder: "TB_Profile",
      }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        photo: secure_url,
        photoPublicId: public_id,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),
  /**
   * @function updatePassword
   * @route /api/v1/users/updatePassword
   * @method PATCH
   */
  updatePassword: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("your current password is incorrect", 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Your password has been updated",
    });
  }),

  /**
   * @function uploadId
   * @route /api/v1/users/uploadId
   * @method PATCH
   */
  uploadId: catchAsync(async (req, res, next) => {
    if (req.user.identityCardPublicId)
      await cloudinary.uploader.destroy(req.user.identityCardPublicId);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      null,
      {
        folder: "TB_ID",
      }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        identityCard: secure_url,
        identityCardPublicId: public_id,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }),
};
