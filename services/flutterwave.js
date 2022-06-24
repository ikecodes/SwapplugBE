const axios = require("axios");
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

exports.getPayUrl = async (data) => {
  const options = {
    url: "https://api.flutterwave.com/v3/payments",
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "content-type": "application/json",
    },
    method: "POST",
    data,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.request(options);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
exports.verifyTransaction = async (transaction_id) => {
  // const options = {
  //   url: `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
  //   headers: {
  //     Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
  //     "content-type": "application/json",
  //   },
  //   method: "GET",
  // };
  return new Promise(async (resolve, reject) => {
    try {
      const response = await flw.Transaction.verify({
        id: transaction_id,
      });
      // const response = await axios.request(options);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
