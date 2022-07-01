const { Router } = require("express");
const auth = require("../middlewares/auth");
const payoutController = require("../controllers/payoutController");

const router = Router();

router.use(auth);

router.route("/getOutgoingPayouts").get(payoutController.getOutgoingPayouts);
router.route("/getIncomingPayouts").get(payoutController.getIncomingPayouts);
router.route("/").post(payoutController.createPayout);
router.route("/:id").patch(payoutController.updatePayout);

module.exports = router;
