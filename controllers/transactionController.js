const Withdraw = require("../models/withdrawModel");
const Transaction = require("../models/transactionModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const {
  getPayUrl,
  verifyTransaction,
  getAccountDetails,
  intializeWithdraw,
  getBanksInNg,
} = require("../services/flutterwave");
const {
  getUserWallet,
  createTransaction,
  updateWallet,
  createWithDraw,
} = require("../helpers/transactions");
const { generateRef } = require("../helpers/generateRef");

let BASE_URL = "";
if (process.env.NODE_ENV === "development") {
  BASE_URL = process.env.LOCAL_BASE_URL;
} else {
  BASE_URL = process.env.REMOTE_BASE_URL;
}

module.exports = {
  /**
   * @function getAllTransactions
   * @route /api/v1/transactions/getAllTransactions
   * @method GET
   */
  getAllTransactions: catchAsync(async (req, res, next) => {
    const getAllTransactions = await Transaction.find({
      userId: req.user._id,
    });
    res.status(200).json({
      status: "success",
      data: getAllTransactions,
    });
  }),
  /**
   * @function getTransaction
   * @route /api/v1/transactions/getTransaction/:id
   * @method GET
   */
  getTransaction: catchAsync(async (req, res, next) => {
    const getTransaction = await Transaction.findById(req.params.id);
    if (!getTransaction)
      return next(new AppError("no transaction with this Id found", 404));
    res.status(200).json({
      status: "success",
      data: getTransaction,
    });
  }),
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
    const redirect_url = `${BASE_URL}/api/v1/transactions/paymentCallback`;
    const tx_ref = await generateRef(req.user._id);
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
  // /**
  //  * @function paymentCallback
  //  * @route /api/v1/transactions/paymentCallback
  //  * @method GET
  //  */
  // paymentCallback: catchAsync(async (req, res, next) => {
  //   const transactionType = "fund";
  //   if (req.query.status === "successful") {
  //     const { transaction_id } = req.query;

  //     const response = await verifyTransaction(transaction_id);

  //     const { status, currency, id, amount, customer } = response.data;

  //     const transactionExist = await Transaction.findOne({
  //       transactionId: id,
  //       userId: req.user._id
  //     });

  //     if (transactionExist) {
  //       return next(new AppError("Transaction already exist", 409));
  //     }

  //     const user = await User.findOne({ email: customer.email });

  //     await createTransaction(user._id, id, status, currency, amount);

  //     await updateWallet(user._id, amount, transactionType);

  //     const wallet = await getUserWallet(user._id);

  //     return res.status(200).json({
  //       response: "wallet funded successfully",
  //       data: wallet,
  //     });
  //   }
  // }),
  /**
   * @function verifyPaymemnt
   * @route /api/v1/transactions/verifyPaymemnt
   * @method POST
   */
  verifyPayment: catchAsync(async (req, res, next) => {
    const transactionType = "fund";

    const { transaction_id } = req.body;

    const response = await verifyTransaction(transaction_id);
    if (response.status === "error")
      return next(new AppError("No transaction was found for this id", 404));

    const { status, currency, id, amount } = response.data;

    const transactionExist = await Transaction.findOne({
      transactionId: id,
      userId: req.user._id,
    });

    if (transactionExist) {
      return next(new AppError("Transaction already exist", 409));
    }
    await createTransaction(req.user._id, id, status, currency, amount);

    if (status === "successful") {
      await updateWallet(req.user._id, amount, transactionType);
      const wallet = await getUserWallet(req.user._id);
      return res.status(200).json({
        response: "wallet funded successfully",
        data: wallet,
      });
    } else if (status === "failed") {
      return next(new AppError("Transaction failed", 400));
    } else {
      return res.status(200).json({
        response: "Payment is being processed",
      });
    }
  }),
  /**
   * @function getBanks
   * @route /api/v1/transactions/getBanks
   * @method GET
   */
  getBanks: catchAsync(async (req, res, next) => {
    response = await getBanksInNg();

    return res.status(200).json({
      message: response.message,
      data: response.data,
    });
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
    const transactionType = "withdraw";
    const userWallet = await getUserWallet(req.user._id);
    if (userWallet.balance < req.body.amount)
      return next(
        new AppError("You do not have enough balance to make withdrawal", 403)
      );

    // remove 45 naira flutterwave fee
    const amountToBeDebited = req.body.amount - 45;
    const details = {
      account_bank: req.body.accountBank,
      account_number: req.body.accountNumber,
      amount: amountToBeDebited,
      narration: req.body.narration,
      currency: "NGN",
      callback_url: `${BASE_URL}/api/v1/transactions/withdrawCallback`,
      debit_currency: "NGN",
      // reference: "cscbjshvsxsxsj_PMCKDU_1",
    };

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
   * @method POST
   */
  withdrawCallback: catchAsync(async (req, res, next) => {
    const { data } = req.body;

    if (data.status === "SUCCESSFUL") {
      await Withdraw.findOneAndUpdate(
        { transactionId: data.id },
        { status: data.status }
      );
      return;
    } else {
      const transactionType = "fund";
      const withdraw = await Withdraw.findOneAndUpdate(
        { transactionId: data.id },
        { status: data.status },
        {
          new: true,
        }
      );
      await updateWallet(withdraw.userId, data.amount, transactionType);
      return;
    }
  }),
  /**
   * @function getAllWithdrawals
   * @route /api/v1/transactions/getAllWithdrawals
   * @method GET
   */
  getAllWithdrawals: catchAsync(async (req, res, next) => {
    const getAllWithdrawals = await Withdraw.find({
      userId: req.user._id,
    });
    res.status(200).json({
      status: "success",
      data: getAllWithdrawals,
    });
  }),
  /**
   * @function getWithdrawal
   * @route /api/v1/transactions/getWithdrawal/:id
   * @method GET
   */
  getWithdrawal: catchAsync(async (req, res, next) => {
    const getWithdrawal = await Withdraw.findById(req.params.id);
    if (!getWithdrawal)
      return next(new AppError("no withdraw with this Id found", 404));
    res.status(200).json({
      status: "success",
      data: getWithdrawal,
    });
  }),
};

// const response = await flw.Transfer.fee({
//   type: "account",
//   amount: 2700,
//   currency: "EUR",
// });
