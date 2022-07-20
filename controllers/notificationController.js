const Token = require("../models/tokenModel");
const Notification = require("../models/notificationModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const FireBaseService = require("../services/firebase");

module.exports = {
  /**
   * @function sendNotification
   * @route /api/v1/notifications/tradeRequest
   * @method POST
   */
  tradeRequest: catchAsync(async (req, res, next) => {
    const savedAccountToken = await Token.findOne({
      userId: req.body.sellerId,
    });

    await Notification.create({
      userId: req.body.sellerId,
      orderId: req.body.orderId,
      title: req.body.title,
      message: req.body.message,
    });

    const fcmData = {
      type: "text",
      message: req.body.message,
      time: `${Date.now()}`,
    };
    const fcmDeviceToken = savedAccountToken.fcmToken;

    const fcmNotification = {
      title: req.body.title,
      body: req.body.message,
    };

    FireBaseService.sendSingleMessage(fcmDeviceToken, fcmData, fcmNotification);

    res.status(200).json({
      status: "success",
    });
  }),

  /**
   * @function getAllNotifications
   * @route /api/v1/notifications
   * @method GET
   */
  getAllNotifications: catchAsync(async (req, res, next) => {
    const notifications = await Notification.find({ userId: req.user._id });

    return res.status(200).json({
      status: "success",
      data: notifications,
    });
  }),
};
