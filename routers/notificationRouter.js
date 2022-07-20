const { Router } = require("express");
const auth = require("../middlewares/auth");
const notificationController = require("../controllers/notificationController");

const router = Router();

router.use(auth);

router.route("/tradeRequest").post(notificationController.tradeRequest);
router.route("/").get(notificationController.getAllNotifications);

module.exports = router;
