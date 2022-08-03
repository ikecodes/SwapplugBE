const { Router } = require("express");
const auth = require("../middlewares/auth");
const coinTransactionController = require("../controllers/coinTransactionController");

const router = Router();

router.use(auth);

router.route("/confirmPayment").post(coinTransactionController.confirmPayment);

router.route("/withdraw").post(coinTransactionController.withdraw);

module.exports = router;
