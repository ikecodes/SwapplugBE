const { Router } = require("express");
const auth = require("../middlewares/auth");
const transactionController = require("../controllers/transactionController");

const router = Router();

router.route("/paymentCallback").get(transactionController.paymentCallback);
router.route("/withdrawCallback").post(transactionController.withdrawCallback);

router.use(auth);

// intialize payment
router
  .route("/initializePayment")
  .post(transactionController.initializePayment);

// get list of banks
router.route("/getBanks").get(transactionController.getBanks);

// verify account details
router
  .route("/verifyAccountDetails")
  .post(transactionController.verifyAccountDetails);

// initialize transfer
router
  .route("/initializeWithdraw")
  .post(transactionController.initializeWithdraw);

module.exports = router;
