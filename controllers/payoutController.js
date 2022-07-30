const Wallet = require("../models/walletModel");
const Payout = require("../models/payoutModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const FireBaseService = require("../services/firebase");
const Token = require("../models/tokenModel");
const agenda = require("../services/agenda");
const { sendToOne } = require("../helpers/notification");

module.exports = {
  /**
   * @function getOutgoingPayouts
   * @route /api/v1/payouts/getOutgoingOrders
   * @method GET
   */
  getOutgoingPayouts: catchAsync(async (req, res, next) => {
    const allOutgoingPayouts = await Payout.find({
      buyer: req.user._id,
    });
    res.status(200).json({
      status: "success",
      data: allOutgoingPayouts,
    });
  }),
  /**
   * @function getIncomingPayouts
   * @route /api/v1/payouts/getIncomingPayouts
   * @method GET
   */
  getIncomingPayouts: catchAsync(async (req, res, next) => {
    const allIncomingPayouts = await Payout.find({
      seller: req.user._id,
    });
    res.status(200).json({
      status: "success",
      data: allIncomingPayouts,
    });
  }),
  /**
   * @function createPayout
   * @route /api/v1/payouts
   * @method POST
   */
  createPayout: catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.body.orderId);

    // check if order has already been paid for
    const alreadyPaid = await Payout.findOne({
      buyer: req.user._id,
      seller: order.seller,
      order: req.body.orderId,
    });
    if (alreadyPaid)
      return next(new AppError("Product has already been paid for", 403));

    // check if this is the buyers order
    if (req.user._id.toString() !== order.buyer._id.toString())
      return next(new AppError("This order does not belong to you", 404));

    // get senders wallet and check for balance
    const senderWallet = await Wallet.findOne({ userId: req.user._id });
    if (senderWallet.balance < parseInt(req.body.amount))
      return next(
        new AppError(
          "You do not have enough balance to perform this transaction",
          403
        )
      );

    // lets know the status to give the order when payment is completed
    let newOrderStatus;
    if (order.type === "cash") {
      newOrderStatus = "purchased";
    } else {
      newOrderStatus = "swapped";
    }
    // create a payout which will be in pending state first
    const amountToBeSent = req.body.amount - req.body.fee;

    const newPayout = await Payout.create({
      order: req.body.orderId,
      amount: amountToBeSent,
      fee: req.body.fee,
      duration: req.body.duration,
    });

    const payoutId = newPayout._id;
    const senderId = req.user._id;
    const receiverId = order.seller._id;
    const amountToBeDebited = req.body.amount;
    const duration = req.body.duration;
    const orderId = req.body.orderId;

    await agenda.schedule(`in ${duration} minutes`, "send money", {
      payoutId,
      senderId,
      receiverId,
      amountToBeDebited,
      orderId,
      newOrderStatus,
      amountToBeSent,
    });
    res.status(200).json({
      status: "success",
      message: "Your payment is on its way",
      data: newPayout,
    });
  }),
  /**
   * @function updatePayout
   * @route /api/v1/payouts/disputePayout/:id
   * @method PATCH
   */
  disputePayout: catchAsync(async (req, res, next) => {
    const payout = await Payout.findById(req.params.id);
    if (payout.status === "completed")
      return next(
        new AppError(
          "This payout has already been made as warranty has expired",
          400
        )
      );
    payout.transfer = false;
    payout.save();

    const notificationType = "text";
    const title = "Cancelled payout";
    const buyerId = req.user._id;
    const buyerMessage = `We have successfully cancelled the payout, support will contact you`;
    const sellerId = payout.order.seller;
    const sellerMessage = `${req.user.firstName} ${req.user.lastName} has cancelled your payout, support will contact you`;

    await Notification.create({
      userId: sellerId,
      type: "payout",
      payoutId: req.params.id,
      title: title,
      message: sellerMessage,
    });
    await Notification.create({
      userId: buyerId,
      type: "payout",
      payoutId: req.params.id,
      title: title,
      message: buyerMessage,
    });
    await Notification.create({
      // userId: payout.order.seller,
      to: "admin",
      type: "payout",
      payoutId: req.params.id,
      title: title,
      message: sellerMessage,
    });

    await sendToOne(sellerId, notificationType, sellerMessage, title);
    await sendToOne(buyerId, notificationType, buyerMessage, title);

    res.status(200).json({
      status: "success",
      data: payout,
    });
  }),
  /**
   * @function getPayout
   * @route /api/v1/payouts/getPayout/:id
   * @method GET
   */
  getPayout: catchAsync(async (req, res, next) => {
    const payout = await Payout.findById(req.params.id);
    if (!payout) return next(new AppError("No payout with this Id found", 404));
    res.status(200).json({
      status: "success",
      data: payout,
    });
  }),
};
