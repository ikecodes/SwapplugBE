const { Router } = require("express");
const auth = require("../middlewares/auth");
const coinTransactionController = require("../controllers/coinTransactionController");

const router = Router();

router.use(auth);

router.route("/webhook/payment").post(coinTransactionController.webhookPayment);

router.route("/makePayment").post(coinTransactionController.makePayment);
router.route("/verifyPayment").post(coinTransactionController.verifyPayment);
router.route("/confirmPayment").post(coinTransactionController.confirmPayment);

router.route("/withdraw/usdt").post(coinTransactionController.withdrawUsdt);
// router.route("/withdraw/ngn").post(coinTransactionController.withdrawNgn);

router.route("/wallet/usdt").get(coinTransactionController.getWallet);

router
  .route("/getAllCoinTransactions")
  .get(coinTransactionController.getAllCoinTransactions);
router
  .route("/getCoinTransaction/:id")
  .get(coinTransactionController.getCoinTransaction);

router
  .route("/getAllCoinWithdraws")
  .get(coinTransactionController.getAllCoinWithdraws);
router
  .route("/getCoinWithdraw/:id")
  .get(coinTransactionController.getCoinWithdraw);

module.exports = router;
