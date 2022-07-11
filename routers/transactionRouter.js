const { Router } = require("express");
const auth = require("../middlewares/auth");
const transactionController = require("../controllers/transactionController");

const router = Router();

// router.route("/paymentCallback").get(transactionController.paymentCallback);
router.route("/withdrawCallback").post(transactionController.withdrawCallback);

router.use(auth);

// get bank details
router.route("/getBankDetails").get(transactionController.getBankDetails);

// add bank details
router.route("/addBankDetails").post(transactionController.addBankDetails);
// intialize payment
router
  .route("/initializePayment")
  .post(transactionController.initializePayment);

// verify payment
router.route("/verifyPayment").post(transactionController.verifyPayment);

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
