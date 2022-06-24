const User = require("../models/userModel");
const Wallet = require("../models/walletModel");
const WalletTransaction = require("../models/walletTransactionModel");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const { getPayUrl, verifyTransaction } = require("../services/flutterwave");
const {
  getUserWallet,
  createWalletTransaction,
  createTransaction,
  updateWallet,
} = require("../helpers/transactions");

module.exports = {
  /**
   * @function getOutgoingOrders
   * @route /api/v1/orders/getOutgoingOrders
   * @method GET
   */
  initializePayment: catchAsync(async (req, res, next) => {
    const customer = {
      email: req.user.email,
      phone_number: req.user.phone,
      name: `${req.user.firstName} ${req.user.lastName}`,
    };
    const redirect_url = `${process.env.LOCAL_BASE_URL}/api/v1/transactions/paymentCallback`;
    const tx_ref = "hooli---1920bboookt3333ytteeey_fuckoff_ikeuu04440ee";
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
   * @function getOutgoingOrders
   * @route /api/v1/orders/getOutgoingOrders
   * @method GET
   */
  paymentCallback: catchAsync(async (req, res, next) => {
    if (req.query.status === "successful") {
      const { transaction_id } = req.query;

      const response = await verifyTransaction(transaction_id);

      const { status, currency, id, amount, customer } = response.data.data;
      const isInflow = true;
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

      await createTransaction(user._id, id, status, currency, amount, customer);

      await updateWallet(user._id, amount);

      const wallet = await getUserWallet(user._id);

      return res.status(200).json({
        response: "wallet funded successfully",
        data: wallet,
      });
      //  res.status(200).json({
      //    status: "success",
      //    data: response.data,
      //  });
    }
  }),
};
