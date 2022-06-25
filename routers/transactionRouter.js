const { Router } = require("express");
const auth = require("../middlewares/auth");
const transactionController = require("../controllers/transactionController");

const router = Router();

router.route("/paymentCallback").get(transactionController.paymentCallback);
router.route("/withdrawCallback").get(transactionController.withdrawCallback);

router.use(auth);
router
  .route("/initializePayment")
  .post(transactionController.initializePayment);
router
  .route("/verifyAccountDetails")
  .post(transactionController.verifyAccountDetails);
router
  .route("/initializeWithdraw")
  .post(transactionController.initializeWithdraw);

module.exports = router;
