const Token = require("../models/tokenModel");
const Notification = require("../models/notificationModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const FireBaseService = require("../services/firebase");
const { sendToOne } = require("../helpers/notification");

module.exports = {
  /**
   * @function sendNotification
   * @route /api/v1/notifications/markRequest
   * @method POST
   */
  markRequest: catchAsync(async (req, res, next) => {
    const sellerId = req.body.sellerId;
    const notificationType = "text";
    const type = "product";
    const title = "New message";
    const message = "One of you product has been marked for possible swap";

    await Notification.create({
      userId: req.body.sellerId,
      productId: req.body.productId,
      type: type,
      title: title,
      message: message,
    });

    await sendToOne(sellerId, notificationType, message, title);

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
