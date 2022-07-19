const { Router } = require("express");
const auth = require("../middlewares/auth");
const coinTransactionController = require("../controllers/coinTransactionController");

const router = Router();

router.use(auth);

router
  .route("/initializePayment")
  .get(coinTransactionController.initializePayment);

module.exports = router;
