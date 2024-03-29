const { Router } = require("express");
const auth = require("../middlewares/auth");
const payoutController = require("../controllers/payoutController");

const router = Router();

router.use(auth);

router.route("/getOutgoingPayouts").get(payoutController.getOutgoingPayouts);
router.route("/getIncomingPayouts").get(payoutController.getIncomingPayouts);
router.route("/getPayout/:id").get(payoutController.getPayout);
router.route("/usdt").post(payoutController.createUsdtPayout);
router.route("/ngn").post(payoutController.createNgnPayout);
router.route("/disputePayout/:id").patch(payoutController.disputePayout);

module.exports = router;
