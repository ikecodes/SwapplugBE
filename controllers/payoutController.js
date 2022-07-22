const Wallet = require("../models/walletModel");
const Payout = require("../models/payoutModel");
const Order = require("../models/orderModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const { transferCash } = require("../services/agenda");
const agenda = require("../services/agenda");

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
   * @route /api/v1/payouts
   * @method PATCH
   */
  updatePayout: catchAsync(async (req, res, next) => {
    const updatedPayout = await Payout.findOneAndUpdate(
      {
        _id: req.params.id,
        buyer: req.user._id,
      },
      req.body,
      { new: true }
    );
    if (!updatedPayout)
      return next(new AppError("No payout found to update", 404));
    res.status(200).json({
      status: "success",
      data: updatedPayout,
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
