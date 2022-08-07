const CoinWallet = require("../models/coinWalletModel");
const Payout = require("../models/payoutModel");
const Order = require("../models/orderModel");

// Send money
exports.sendUSDT = async (
  payoutId,
  senderId,
  receiverId,
  amountToBeDebited,
  orderId,
  newOrderStatus,
  amountToBeSent
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payout = await Payout.findById(payoutId);
      if (payout.transfer === true) {
        const senderWallet = await CoinWallet.findOne({
          userId: senderId,
          type: "USDT",
        });
        senderWallet.balance -= amountToBeDebited;
        await senderWallet.save();

        const receiverWallet = await CoinWallet.findOne({
          userId: receiverId,
          type: "USDT",
        });
        receiverWallet.balance += amountToBeSent;
        await receiverWallet.save();

        const payoutPromise = Payout.findByIdAndUpdate(payoutId, {
          status: "completed",
        });
        const orderPromise = Order.findByIdAndUpdate(orderId, {
          status: newOrderStatus,
        });
        await Promise.all([payoutPromise, orderPromise]);
      }
      resolve(payout);
    } catch (error) {
      await Payout.findByIdAndUpdate(payoutId, {
        status: "failed",
      });
      await Order.findByIdAndUpdate(orderId, {
        status: "failed",
      });
      reject(error);
    }
  });
};
