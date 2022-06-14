const Order = require("../models/orderModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

module.exports = {
  /**
   * @function getOutgoingOrders
   * @route /api/v1/orders/getOutgoingOrders
   * @method GET
   */
  getOutgoingOrders: catchAsync(async (req, res, next) => {
    const allOutgoingOrders = await Order.find({
      buyer: req.user.id,
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
      seller: req.user.id,
    });

    res.status(200).json({
      status: "success",
      data: allIncomingOrders,
    });
  }),
  /**
   * @function createOrder
   * @route /api/v1/orders
   * @method POST
   */
  createOrder: catchAsync(async (req, res, next) => {
    const alreadyInOrders = await Order.findOne({
      buyer: req.user.id,
      seller: req.body.sellerId,
      product: req.body.productId,
    });
    if (alreadyInOrders)
      return next(new AppError("Product already in orders", 403));

    const newOrder = await Order.create({
      buyer: req.user.id,
      seller: req.body.sellerId,
      product: req.body.productId,
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
        buyer: req.user.id,
        seller: req.body.sellerId,
        product: req.body.productId,
      },
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  }),
};
