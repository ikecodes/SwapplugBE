const Lazerpay = require("lazerpay-node-sdk").default;

const lazer = new Lazerpay(
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

// exports.verifyPayment = async (ref) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const payload = {
//         identifier: ref,
//       };
//       const response = await lazerpay.Payment.confirmPayment(payload);
//       resolve(response);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
exports.initializeWithdraw = async (transaction_payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await lazer.Payout.transferCrypto(transaction_payload);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
