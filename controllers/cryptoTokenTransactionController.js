const CryptoTokenTransaction = require("../models/cryptoTokenTransactionModel");
const TokenWallet = require("../models/tokenWalletModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

const { generateRef } = require("../helpers/generateRef");
const { initializeWithdraw } = require("../services/lazerpay");

module.exports = {
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

    const transactionExists = await CryptoTokenTransaction.findOne({ id: id });
    if (transactionExists)
      return next(new AppError("This transaction already exists", 400));
    await CryptoTokenTransaction.create({
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
      const tokenWalletExists = await TokenWallet.findOne({
        type: "USDT",
        userId: req.user._id,
      });
      if (!tokenWalletExists) {
        await TokenWallet.create({
          balance: amountPaid,
          type: "USDT",
          userId: req.user._id,
        });
      } else {
        tokenWalletExists.balance += amountPaid;
        await tokenWalletExists.save();
      }
    }

    const updatedWallet = await TokenWallet.findOne({
      type: "USDT",
      userId: req.user._id,
    });
    res.status(200).json({
      status: "success",
      data: updatedWallet,
    });
  }),
  /**
   * @function withdraw
   * @route /api/v1/coins/withdraw
   * @method POST
   */
  withdraw: catchAsync(async (req, res, next) => {
    const transaction_payload = {
      amount: req.body.amount,
      recipient: req.body.address, // address must be a bep20 address
      coin: "USDT",
      blockchain: "Binance Smart Chain",
    };

    const response = await initializeWithdraw(transaction_payload);

    res.status(200).json({
      status: "success",
      data: response,
    });
  }),
};
