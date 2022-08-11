var crypto = require("crypto");
const User = require("../models/userModel");
const CoinTransaction = require("../models/coinTransactionModel");
const CoinWithdraw = require("../models/coinWithdrawModel");
const CoinWallet = require("../models/coinWalletModel");
const Webhook = require("../models/webhook");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const {
  initializeWithdraw,
  initializePayment,
  verifyPayment,
} = require("../services/lazerpay");
const { generateRef } = require("../helpers/generateRef");

module.exports = {
  /**
   * @function webhookPayment
   * @route /api/v1/coins/webhook/payment
   * @method POST
   */
  webhookPayment: catchAsync(async (req, res, next) => {
    await Webhook.create({ text: "called webhook" });
    // var hash = crypto
    //   .createHmac("sha256", process.env.TEST_LAZER_SECRET_KEY)
    //   .update(JSON.stringify(req.body), "utf8")
    //   .digest("hex");
    // if (hash !== req.headers["x-lazerpay-signature"])
    //   return res.sendStatus(200);

    if (req.body.webhookType === "DEPOSIT_TRANSACTION") {
      const { id, reference, coin, customerEmail, amountPaid, status } =
        req.body;
      const transactionExists = await CoinTransaction.findOne({
        id: id,
        reference: reference,
      });

      if (transactionExists && transactionExists.status !== "confirmed") {
        const coinWallet = await CoinWallet.findOne({
          type: coin,
          userId: transactionExists.userId,
        });
        coinWallet.balance += amountPaid;
        await coinWallet.save();
        await CoinTransaction.findByIdAndUpdate(transactionExists._id, {
          status: status,
        });
      }
    } else {
      // task for deposites
    }
    res.sendStatus(200);
  }),
  /**
   * @function makePayment
   * @route /api/v1/coins/makePayment
   * @method POST
   */
  makePayment: catchAsync(async (req, res, next) => {
    const ref = await generateRef(req.user._id);
    console.log(req.user.firstName, req.user.lastName);
    const transaction_payload = {
      reference: ref, // Replace with a reference you generated
      customer_name: `${req.user.firstName} ${req.user.lastName}`,
      customer_email: `${req.user.email}`,
      coin: "USDT",
      currency: "NGN",
      amount: req.body.amount,
      acceptPartialPayment: false, // By default it's false
    };
    const response = await initializePayment(transaction_payload);
    res.status(response.statusCode).json({
      status: response.status,
      message: response.message,
      data: response.data,
    });
  }),
  /**
   * @function verifyPayment
   * @route /api/v1/coins/verifyPayment
   * @method POST
   */
  verifyPayment: catchAsync(async (req, res, next) => {
    const response = await verifyPayment(req.body.ref);
    res.status(response.statusCode).json({
      status: response.status,
      message: response.message,
      data: response.data,
    });
  }),

  /**
   * @function confirmPayment
   * @route /api/v1/coins/confirmPayment
   * @method POST
   */
  confirmPayment: catchAsync(async (req, res, next) => {
    const {
      acceptPartialPayment,
      actualAmount,
      amountPaid,
      amountPaidFiat,
      amountReceived,
      amountReceivedFiat,
      blockNumber,
      blockchain,
      coin,
      currency,
      feeInCrypto,
      fiatAmount,
      hash,
      id,
      network,
      recipientAddress,
      reference,
      senderAddress,
      status,
      type,
    } = req.body;

    const transactionExists = await CoinTransaction.findOne({
      id,
      reference,
    });
    if (transactionExists)
      return next(new AppError("This transaction already exists", 400));
    await CoinTransaction.create({
      userId: req.user._id,
      acceptPartialPayment,
      actualAmount,
      amountPaid,
      amountPaidFiat,
      amountReceived,
      amountReceivedFiat,
      blockNumber,
      blockchain,
      coin,
      currency,
      feeInCrypto,
      fiatAmount,
      hash,
      id,
      network,
      recipientAddress,
      reference,
      senderAddress,
      status,
      type,
    });

    if (status === "confirmed") {
      const coinWalletExists = await CoinWallet.findOne({
        type: "USDT",
        userId: req.user._id,
      });
      if (!coinWalletExists) {
        await CoinWallet.create({
          balance: amountPaid,
          type: "USDT",
          userId: req.user._id,
        });
      } else {
        coinWalletExists.balance += amountPaid;
        await coinWalletExists.save();
      }
    }

    res.status(200).json({
      status: "success",
    });
  }),
  /**
   * @function withdrawUsdt
   * @route /api/v1/coins/withdraw/usdt
   * @method POST
   */
  withdrawUsdt: catchAsync(async (req, res, next) => {
    const userWallet = await CoinWallet.findOne({
      userId: req.user._id,
      type: "USDT",
    });
    if (userWallet.balance < req.body.amount)
      return next(
        new AppError("You do not have enough balance to make withdrawal", 403)
      );
    if (req.body.amount < 1)
      return next(new AppError("You can only withdraw 1 USDT and above", 403));

    const data = {
      amount: req.body.amount,
      recipient: req.body.recipient,
      coin: "USDT",
      blockchain: "Binance Smart Chain",
    };
    const response = await initializeWithdraw(data);
    if (response?.status === "success") {
      await CoinWallet.create({
        userId: req.user._id,
        recipientAddress: req.body.recipient,
        actualAmount: req.body.amount,
        amountPaid: req.body.amount,
        amountReceived: req.body.amount,
        coin: "USDT",
        type: "withdrawal",
        status: "incomplete",
        blockchain: "Binance Smart Chain",
      });
    }
    res.status(200).json({
      status: response.status,
      message: response.message,
      // data: response,
    });
  }),
  // /**
  //  * @function withdrawNgn
  //  * @route /api/v1/coins/withdraw/ngn
  //  * @method POST
  //  */
  // withdrawNgn: catchAsync(async (req, res, next) => {
  //   const data = {
  //     amount: req.body.amount,
  //     recipient: req.body.recipient,
  //     coin: req.body.coin,
  //     blockchain: req.body.blockchain,
  //   };
  //   const response = await initializeWithdraw(data);
  //   console.log(response);
  //   res.status(200).json({
  //     status: "success",
  //   });
  // }),
  /**
   * @function getWallet
   * @route /api/v1/coins/wallet
   * @method GET
   */
  getWallet: catchAsync(async (req, res, next) => {
    const wallet = await CoinWallet.findOne({
      userId: req.user._id,
      type: "USDT",
    });
    res.status(200).json({
      status: "success",
      data: wallet,
    });
  }),

  /**
   * @function getAllCoinTransactions
   * @route /api/v1/coins/getAllCoinTransactions
   * @method GET
   */
  getAllCoinTransactions: catchAsync(async (req, res, next) => {
    const allCoinTransactions = await CoinTransaction.find({
      userId: req.user._id,
    });
    res.status(200).json({
      status: "success",
      data: allCoinTransactions,
    });
  }),
  /**
   * @function getCoinTransaction
   * @route /api/v1/coins/getCoinTransaction/:id
   * @method GET
   */
  getCoinTransaction: catchAsync(async (req, res, next) => {
    const coinTransaction = await CoinTransaction.findById(req.params.id);
    if (!coinTransaction)
      return next(new AppError("no transaction with this Id found", 404));
    res.status(200).json({
      status: "success",
      data: coinTransaction,
    });
  }),
};
