var crypto = require("crypto");
const CoinTransaction = require("../models/coinTransactionModel");
const CoinWallet = require("../models/coinWalletModel");
const Webhook = require("../models/webhook");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const { initializeWithdraw } = require("../services/lazerpay");

module.exports = {
  /**
   * @function webhookPayment
   * @route /api/v1/coins/webhook/payment
   * @method POST
   */
  webhookPayment: catchAsync(async (req, res, next) => {
    await Webhook.create({ text: "i reach" });
    var hash = crypto
      .createHmac("sha256", process.env.TEST_LAZER_SECRET_KEY)
      .update(JSON.stringify(req.body), "utf8")
      .digest("hex");

    if (hash !== req.headers["x-lazerpay-signature"])
      return res.sendStatus(200);
    const data = req.body;
    await Webhook.create({ text: data.webhookType });

    if (data.webhookType === "DEPOSIT_TRANSACTION") {
      const transactionExists = await CoinTransaction.findOne({
        id: data.id,
        reference: data.reference,
      });

      if (transactionExists && transactionExists.status !== "confirmed") {
        const coinWalletExists = await CoinWallet.findOne({
          type: data.coin,
          userId: data.customer.id,
        });
        if (!coinWalletExists) {
          await CoinWallet.create({
            balance: data.amountPaid,
            type: data.coin,
            userId: data.customer.id,
          });
        } else {
          coinWalletExists.balance += data.amountPaid;
          await coinWalletExists.save();
        }
        await CoinTransaction.findByIdAndUpdate(transactionExists._id, {
          status: data.status,
        });
      }
    } else {
      console.log("for deposite");
    }

    res.sendStatus(200);
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
   * @function withdraw
   * @route /api/v1/coins/withdraw
   * @method POST
   */
  withdraw: catchAsync(async (req, res, next) => {
    const data = {
      amount: req.body.amount,
      recipient: req.body.recipient,
      coin: req.body.coin,
      blockchain: req.body.blockchain,
    };

    const response = await initializeWithdraw(data);
    console.log(response);
    res.status(200).json({
      status: "success",
      // data: response,
    });
  }),
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
