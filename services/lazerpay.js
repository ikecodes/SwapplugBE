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
