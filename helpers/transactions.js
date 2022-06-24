const Wallet = require("../models/walletModel");
const WalletTransaction = require("../models/walletTransactionModel");
const Transaction = require("../models/transactionModel");
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
exports.createTransaction = async (
  userId,
  id,
  status,
  currency,
  amount,
  customer
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // create transaction

      const transaction = await Transaction.create({
        userId,
        transactionId: id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone_number,
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

// Update wallet
exports.updateWallet = async (userId, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallet = await Wallet.findOne({ userId });
      wallet.balance += amount;
      await wallet.save();
      resolve(wallet);
    } catch (error) {
      reject(error);
    }
  });
};
