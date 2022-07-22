const Agenda = require("agenda");
const dotenv = require("dotenv");
dotenv.config();

const { sendMoney } = require("../helpers/transactions");

const agenda = new Agenda({
  db: { address: process.env.REMOTE_DATABASE, collection: "jobs" },
  processEvery: "30 seconds",
  maxConcurrency: 20,
});

// definitions
agenda.define(
  "send money",
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
      await sendMoney(
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
