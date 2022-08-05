const { Router } = require("express");
const auth = require("../middlewares/auth");
const coinTransactionController = require("../controllers/coinTransactionController");

const router = Router();

router.use(auth);

router.route("/webhook/payment").post(coinTransactionController.webhookPayment);
router.route("/confirmPayment").post(coinTransactionController.confirmPayment);
router.route("/wallet/usdt").get(coinTransactionController.getWallet);

router.route("/withdraw").post(coinTransactionController.withdraw);

module.exports = router;
