const Withdraw = require("../models/withdrawModel");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

const {
  getUserWallet,
  createTransaction,
  updateWallet,
  createWithDraw,
} = require("../helpers/transactions");
const { generateRef } = require("../helpers/generateRef");
const { initializePayment } = require("../services/lazerpay");

module.exports = {
  /**
   * @function initializePayment
   * @route /api/v1/coins/initializePayment
   * @method POST
   */
  initializePayment: catchAsync(async (req, res, next) => {
    const reference = await generateRef(req.user._id);
    const data = {
      reference,
      customer_name: `${req.user.firstName} ${req.user.lastName}`,
      customer_email: req.user.email,
      coin: "USDC",
      currency: "USD",
      fiatAmount: "100",
      acceptPartialPayment: true,
    };
    const response = await initializePayment(data);

    console.log(response);
    res.status(200).json({
      status: "success",
      data: response.data,
    });
  }),
};
