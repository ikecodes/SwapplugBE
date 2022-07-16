const Token = require("../models/tokenModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

module.exports = {
  /**
   * @function saveFCMToken
   * @description save FCM token
   */
  saveFCMToken: catchAsync(async (req, res, next) => {
    const { token } = req.body;
    const savedAccountToken = await Token.findOne({ userId: req.user._id });
    //update account if already exists
    if (savedAccountToken) {
      savedAccountToken.fcmToken = token;
      savedAccountToken.save();
    }
    //create a new account
    else {
      await Token.create({
        userId: req.user._id,
        fcmToken: token,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "fcm token set successfully",
    });
  }),

  /**
   * @function getFCMToken
   * @description get saved fcm token
   */
  getFCMToken: catchAsync(async (req, res, next) => {
    const savedAccount = await Token.findOne({ userId: req.user._id });
    //record found
    if (!savedAccount) return next(new AppError("Token not found", 404));
    const token = savedAccount.fcmToken;
    return res.status(200).json({
      status: "success",
      data: token,
    });
  }),
};
