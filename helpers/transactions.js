const Wallet = require("../models/walletModel");
const WalletTransaction = require("../models/walletTransactionModel");
const Transaction = require("../models/transactionModel");
const Withdraw = require("../models/withdrawModel");
// Get User wallet
exports.getUserWallet = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userWallet = await Wallet.findOne({ userId });
      resolve(userWallet);
    } catch (error) {
      reject(error);
    }
  });
};

// Create Wallet Transaction
exports.createWalletTransaction = async (
  userId,
  status,
  isInflow,
  currency,
  amount
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // create wallet transaction
      const walletTransaction = await WalletTransaction.create({
        amount,
        userId,
        isInflow,
        currency,
        status,
      });
      resolve(walletTransaction);
    } catch (error) {
      reject(error);
    }
  });
};

// Create Transaction
exports.createTransaction = async (userId, id, status, currency, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = await Transaction.create({
        userId,
        transactionId: id,
        amount,
        currency,
        paymentStatus: status,
        paymentGateway: "flutterwave",
      });
      resolve(transaction);
    } catch (error) {
      reject(error);
    }
  });
};
// Create Withdraw
exports.createWithDraw = async ({
  userId,
  transactionId,
  accountNumber,
  bankCode,
  bankName,
  amount,
  currency,
  narration,
  transactionStatus,
  transactionDate,
  reference,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const withdraw = await Withdraw.create({
        userId,
        transactionId,
        accountNumber,
        bankCode,
        bankName,
        amount,
        currency,
        narration,
        transactionStatus,
        transactionDate,
        reference,
      });
      resolve(withdraw);
    } catch (error) {
      reject(error);
    }
  });
};

// Update wallet
exports.updateWallet = async (userId, amount, transactionType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallet = await Wallet.findOne({ userId });
      if (transactionType === "fund") {
        wallet.balance += amount;
      } else {
        wallet.balance -= amount;
      }
      await wallet.save();
      resolve(wallet);
    } catch (error) {
      reject(error);
    }
  });
};
