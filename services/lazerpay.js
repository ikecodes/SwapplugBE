const Lazerpay = require("lazerpay-node-sdk").default;

const lazerpay = new Lazerpay(
  process.env.TEST_LAZER_PUBLIC_KEY,
  process.env.TEST_LAZER_SECRET_KEY
);

// exports.initializePayment = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await lazerpay.Payment.initializePayment(data);
//       resolve(response);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

exports.verifyPayment = async (ref) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = {
        identifier: ref,
      };
      const response = await lazerpay.Payment.confirmPayment(payload);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
exports.initializeWithdraw = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction_payload = {
        amount: 1,
        recipient: "0x0B4d358D349809037003F96A3593ff9015E89efA", // address must be a bep20 address
        coin: "USDT",
        blockchain: "Binance Smart Chain",
      };
      const response = await lazer.Payout.transferCrypto(transaction_payload);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
