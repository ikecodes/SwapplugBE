const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");
const Withdraw = require("../models/withdrawModel");
const Payout = require("../models/payoutModel");
// Get User wallet
exports.getUserWallet = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userWallet = await Wallet.findOne({ userId });
      if (!userWallet) {
        const wallet = await Wallet.create({
          userId,
        });
        resolve(wallet);
      }
      resolve(userWallet);
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
      const wallet = await this.getUserWallet(userId);
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
// Send money
exports.sendMoney = async (payoutId, senderId, receiverId, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const senderWallet = await Wallet.findOne({ userId: senderId });
      senderWallet.balance -= amount;
      await senderWallet.save();

      const receiverWallet = await Wallet.findOne({ userId: receiverId });
      receiverWallet.balance += amount;
      await receiverWallet.save();

      const payout = await Payout.findByIdAndUpdate(payoutId, {
        status: "completed",
      });
      resolve(payout);
    } catch (error) {
      await Payout.findByIdAndUpdate(payoutId, {
        status: "failed",
      });
      reject(error);
    }
  });
};
