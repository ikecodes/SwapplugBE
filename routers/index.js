const { Router } = require("express");
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const orderRouter = require("./orderRouter");
const favoriteRouter = require("./favoriteRouter");
const reviewRouter = require("./reviewRouter");
const transactionRouter = require("./transactionRouter");
const payoutRouter = require("./payoutRouter");
const bankRouter = require("./bankRouter");
const tokenRouter = require("./tokenRouter");
const conversationRouter = require("./conversationRouter");
const messageRouter = require("./messageRouter");
const cryptoTokenRouter = require("./cryptoTokenRouter");
const notificationRouter = require("./notificationRouter");
const reportRouter = require("./reportRouter");

const router = Router();

router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/favorites", favoriteRouter);
router.use("/reviews", reviewRouter);
router.use("/transactions", transactionRouter);
router.use("/payouts", payoutRouter);
router.use("/banks", bankRouter);
router.use("/tokens", tokenRouter);
router.use("/conversations", conversationRouter);
router.use("/messages", messageRouter);
router.use("/crypto/tokens", cryptoTokenRouter);
router.use("/notifications", notificationRouter);
router.use("/reports", reportRouter);

module.exports = router;
