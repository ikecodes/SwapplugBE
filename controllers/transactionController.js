const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const WalletTransaction = require("../models/walletTransactionModel");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const {
  getPayUrl,
  verifyTransaction,
  getAccountDetails,
  intializeWithdraw,
} = require("../services/flutterwave");
const {
  getUserWallet,
  createWalletTransaction,
  createTransaction,
  updateWallet,
  createWithDraw,
} = require("../helpers/transactions");
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

module.exports = {
  /**
   * @function initializePayment
   * @route /api/v1/transactions/initializePayment
   * @method GET
   */
  initializePayment: catchAsync(async (req, res, next) => {
    const customer = {
      email: req.user.email,
      phone_number: req.user.phone,
      name: `${req.user.firstName} ${req.user.lastName}`,
    };
    const redirect_url = `${process.env.LOCAL_BASE_URL}/api/v1/transactions/paymentCallback`;
    const tx_ref = "hooli---1920bboookt3333ytteedddey_fuckoff_ikeuu04440ee";
    const data = {
      ...req.body,
      tx_ref,
      currency: "NGN",
      country: "NG",
      payment_options: "card",
      redirect_url,
      customer,
    };
    const response = await getPayUrl(data);

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  }),
  /**
   * @function paymentCallback
   * @route /api/v1/transactions/paymentCallback
   * @method GET
   */
  paymentCallback: catchAsync(async (req, res, next) => {
    const isInflow = true;
    const transactionType = "fund";

    if (req.query.status === "successful") {
      const { transaction_id } = req.query;

      const response = await verifyTransaction(transaction_id);

      const { status, currency, id, amount, customer } = response.data;

      const transactionExist = await Transaction.findOne({
        transactionId: id,
      });

      if (transactionExist) {
        return next(new AppError("Transaction already exist", 409));
      }

      const user = await User.findOne({ email: customer.email });

      await createWalletTransaction(
        user._id,
        status,
        isInflow,
        currency,
        amount
      );

      await createTransaction(user._id, id, status, currency, amount);

      await updateWallet(user._id, amount, transactionType);

      const wallet = await getUserWallet(user._id);

      return res.status(200).json({
        response: "wallet funded successfully",
        data: wallet,
      });
    }
  }),
  /**
   * @function verifyAccountDetails
   * @route /api/v1/transactions/verifyAccountDetails
   * @method POST
   */
  verifyAccountDetails: catchAsync(async (req, res, next) => {
    const details = {
      account_number: req.body.accountNumber,
      account_bank: req.body.bankCode,
    };
    const response = await getAccountDetails(details);
    return res.status(200).json({
      message: response.message,
      data: response.data,
    });
  }),
  /**
   * @function initializeWithdraw
   * @route /api/v1/transactions/initializeWithdraw
   * @method POST
   */
  initializeWithdraw: catchAsync(async (req, res, next) => {
    const isInflow = false;
    const transactionType = "withdraw";

    const userWallet = await getUserWallet(req.user._id);
    if (userWallet.balance < req.body.amount)
      return next(
        new AppError("You do not have enough balance to make withdrawal", 403)
      );

    const details = {
      account_bank: req.body.accountBank,
      account_number: req.body.accountNumber,
      amount: req.body.amount,
      narration: req.body.narration,
      currency: "NGN",
      callback_url: `${process.env.LOCAL_BASE_URL}/api/v1/transactions/withdrawCallback`,
      debit_currency: "NGN",
    };
    // flw.Transfer.initiate(details).then(console.log).catch(console.log);

    const response = await intializeWithdraw(details);

    const {
      id,
      account_number,
      bank_code,
      bank_name,
      amount,
      currency,
      narration,
      status,
      created_at,
      reference,
    } = response.data;

    const data = {
      userId: req.user._id,
      transactionId: id,
      accountNumber: account_number,
      bankCode: bank_code,
      bankName: bank_name,
      amount: amount,
      currency: currency,
      narration: narration,
      transactionStatus: status,
      transactionDate: created_at,
      reference: reference,
    };

    await createWalletTransaction(
      req.user._id,
      status,
      isInflow,
      currency,
      amount
    );

    await createWithDraw(data);

    await updateWallet(req.user._id, amount, transactionType);

    const wallet = await getUserWallet(req.user._id);

    return res.status(200).json({
      message: "Withdraw successful",
      data: wallet,
    });
  }),
  /**
   * @function withdrawCallback
   * @route /api/v1/transactions/withdrawCallback
   * @method GET
   */
  withdrawCallback: catchAsync(async (req, res, next) => {
    console.log("////////////////////CALLBACK", req.query);
  }),
};
