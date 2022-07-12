const { Router } = require("express");
const auth = require("../middlewares/auth");
const transactionController = require("../controllers/transactionController");

const router = Router();

// router.route("/paymentCallback").get(transactionController.paymentCallback);
router.route("/withdrawCallback").post(transactionController.withdrawCallback);

router.use(auth);

// get all transactions
router
  .route("/getAllTransactions")
  .get(transactionController.getAllTransactions);

// get transaction
router.route("/getTransaction/:id").get(transactionController.getTransaction);

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

// get all withdrawals
router.route("/getAllWithdrawals").get(transactionController.getAllWithdrawals);
// get withdrawal
router.route("/getWithdrawal/:id").get(transactionController.getWithdrawal);

module.exports = router;
