const Wallet = require("../models/walletModel");
const Payout = require("../models/payoutModel");
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
    const alreadyPaid = await Payout.findOne({
      buyer: req.user._id,
      seller: req.body.sellerId,
      product: req.body.productId,
    });
    if (alreadyPaid)
      return next(new AppError("Product has already been paid for", 403));

    const senderWallet = await Wallet.findOne({ userId: req.user._id });

    if (senderWallet.balance < parseInt(req.body.amount))
      return next(
        new AppError(
          "You do not have enough balance to perform this transaction",
          403
        )
      );

    // create a payout which will be in pending state first
    const newPayout = await Payout.create({
      buyer: req.user._id,
      seller: req.body.sellerId,
      product: req.body.productId,
      amount: req.body.amount,
    });

    const payoutId = newPayout._id;
    const senderId = req.user._id;
    const receiverId = req.body.sellerId;
    const amount = req.body.amount;
    const duration = req.body.duration;

    await agenda.schedule(`in ${duration} minutes`, "send money", {
      payoutId,
      senderId,
      receiverId,
      amount,
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
};
