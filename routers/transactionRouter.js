const { Router } = require("express");
const auth = require("../middlewares/auth");
const transactionController = require("../controllers/transactionController");

const router = Router();

router.route("/paymentCallback").get(transactionController.paymentCallback);

router.use(auth);
router
  .route("/initializePayment")
  .post(transactionController.initializePayment);

module.exports = router;
