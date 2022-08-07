const Agenda = require("agenda");
const dotenv = require("dotenv");
dotenv.config();

const { sendNGN } = require("../helpers/transactions");
const { sendUSDT } = require("../helpers/coinTransactions");

const agenda = new Agenda({
  db: { address: process.env.REMOTE_DATABASE, collection: "jobs" },
  processEvery: "30 seconds",
  maxConcurrency: 20,
});

// definitions
agenda.define(
  "agendaSendNGN",
  { priority: "high", concurrency: 10 },
  async (job) => {
    const {
      payoutId,
      senderId,
      receiverId,
      amountToBeDebited,
      orderId,
      newOrderStatus,
      amountToBeSent,
    } = job.attrs.data;
    try {
      await sendNGN(
        payoutId,
        senderId,
        receiverId,
        amountToBeDebited,
        orderId,
        newOrderStatus,
        amountToBeSent
      );
    } catch (error) {
      console.log(error);
    }
  }
);
// definitions
agenda.define(
  "agendaSendUSDT",
  { priority: "high", concurrency: 10 },
  async (job) => {
    const {
      payoutId,
      senderId,
      receiverId,
      amountToBeDebited,
      orderId,
      newOrderStatus,
      amountToBeSent,
    } = job.attrs.data;
    try {
      await sendUSDT(
        payoutId,
        senderId,
        receiverId,
        amountToBeDebited,
        orderId,
        newOrderStatus,
        amountToBeSent
      );
    } catch (error) {
      console.log(error);
    }
  }
);

// listen for the ready or error event.
agenda
  .on("ready", () => console.log("Agenda started!"))
  .on("error", () => console.log("Agenda connection error!"));

module.exports = agenda;
