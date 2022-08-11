const axios = require("axios");

const Lazerpay = require("lazerpay-node-sdk").default;

const lazer = new Lazerpay(
  process.env.TEST_LAZER_PUBLIC_KEY,
  process.env.TEST_LAZER_SECRET_KEY
);

exports.initializePayment = async (transaction_payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await lazer.Payment.initializePayment(
        transaction_payload
      );
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
};

exports.verifyPayment = async (ref) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = {
        identifier: ref,
      };
      const response = await lazer.Payment.confirmPayment(payload);
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
};
exports.initializeWithdraw = async (transaction_payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await lazer.Payout.transferCrypto(transaction_payload);
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
};

// exports.initializeWithdraw = async (data) => {
//   const options = {
//     url: "https://api.lazerpay.engineering/api/v1/transfer",
//     headers: {
//       Authorization: `Bearer ${process.env.TEST_LAZER_SECRET_KEY}`,
//       "content-type": "application/json",
//     },
//     method: "POST",
//     data,
//   };
//   return new Promise(async (resolve, reject) => {
//     try {
//       const response = await axios.request(options);
//       resolve(response);
//     } catch (error) {
//       reject(error.response.data);
//     }
//   });
// };
