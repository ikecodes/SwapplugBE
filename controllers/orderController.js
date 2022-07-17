const Order = require("../models/orderModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const Token = require("../models/tokenModel");
const FireBaseService = require("../services/firebase");

module.exports = {
  /**
   * @function getOutgoingOrders
   * @route /api/v1/orders/getOutgoingOrders
   * @method GET
   */
  getOutgoingOrders: catchAsync(async (req, res, next) => {
    const allOutgoingOrders = await Order.find({
      buyer: req.user._id,
    });

    res.status(200).json({
      status: "success",
      data: allOutgoingOrders,
    });
  }),
  /**
   * @function getIncomingOrders
   * @route /api/v1/orders/getIncomingOrders
   * @method GET
   */
  getIncomingOrders: catchAsync(async (req, res, next) => {
    const allIncomingOrders = await Order.find({
      seller: req.user._id,
    });

    res.status(200).json({
      status: "success",
      data: allIncomingOrders,
    });
  }),
  /**
   * @function sendNotification
   * @route /api/v1/orders/sendNotification
   * @method POST
   */
  sendNotification: catchAsync(async (req, res, next) => {
    const savedAccountToken = await Token.findOne({
      userId: req.body.sellerId,
    });

    const fcmData = {
      type: "text",
      message: req.body.message,
      time: `${Date.now()}`,
    };
    const fcmDeviceToken = savedAccountToken.fcmToken;

    const fcmNotification = {
      title: "New message",
      body: req.body.message,
    };

    FireBaseService.sendSingleMessage(fcmDeviceToken, fcmData, fcmNotification);

    res.status(200).json({
      status: "success",
    });
  }),

  /**
   * @function createOrder
   * @route /api/v1/orders
   * @method POST
   */
  createOrder: catchAsync(async (req, res, next) => {
    const alreadyInOrders = await Order.findOne({
      buyer: req.user._id,
      seller: req.body.sellerId,
      product: req.body.productId,
    });
    if (alreadyInOrders)
      return next(new AppError("Product already in orders", 403));

    const newOrder = await Order.create({
      buyer: req.user._id,
      seller: req.body.sellerId,
      product: req.body.productId,
      type: req.body.type,
      swapProduct: req.body.swapProduct,
      status: "previewed",
    });
    res.status(200).json({
      status: "success",
      data: newOrder,
    });
  }),
  /**
   * @function updateOrder
   * @route /api/v1/orders
   * @method PATCH
   */
  updateOrder: catchAsync(async (req, res, next) => {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        buyer: req.user._id,
      },
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  }),
  /**
   * @function deleteOrder
   * @route /api/v1/orders
   * @method DELETE
   */
  deleteOrder: catchAsync(async (req, res, next) => {
    await Order.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
    });
  }),
  /**
   * @function getOrder
   * @route /api/v1/orders
   * @method GET
   */
  getOrder: catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: order,
    });
  }),
};
