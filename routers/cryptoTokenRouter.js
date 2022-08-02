const { Router } = require("express");
const auth = require("../middlewares/auth");
const cryptoTokenTransactionController = require("../controllers/cryptoTokenTransactionController");

const router = Router();

router.use(auth);

router
  .route("/confirmPayment")
  .post(cryptoTokenTransactionController.confirmPayment);

router.route("/withdraw").post(cryptoTokenTransactionController.withdraw);

module.exports = router;
