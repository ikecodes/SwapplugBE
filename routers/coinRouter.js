const { Router } = require("express");
const auth = require("../middlewares/auth");
const coinTransactionController = require("../controllers/coinTransactionController");

const router = Router();

router.use(auth);

router.route("/webhook/payment").post(coinTransactionController.webhookPayment);
router.route("/confirmPayment").post(coinTransactionController.confirmPayment);
router.route("/withdraw/usdt").post(coinTransactionController.withdraw);
router.route("/withdraw/ngn").post(coinTransactionController.withdraw);

router.route("/wallet/usdt").get(coinTransactionController.getWallet);

router
  .route("/getAllCoinTransactions")
  .get(coinTransactionController.getAllCoinTransactions);
router
  .route("/getCoinTransaction/:id")
  .get(coinTransactionController.getCoinTransaction);
module.exports = router;
