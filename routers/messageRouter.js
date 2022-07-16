const { Router } = require("express");
const auth = require("../middlewares/auth");
const messageController = require("../controllers/messageController");

const router = Router();

router.use(auth);

router.route("/").post(messageController.sendMessage);
router.route("/:id").get(messageController.getAllMessages);
module.exports = router;
