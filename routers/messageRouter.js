const { Router } = require("express");
const auth = require("../middlewares/auth");
const messageController = require("../controllers/messageController");
const upload = require("../services/multer");

const router = Router();

router.use(auth);

router.route("/").post(messageController.sendMessage);
router.route("/:id").get(messageController.getAllMessages);
router
  .route("/getImageUrl")
  .post(upload.single("image"), messageController.getImageUrl);
module.exports = router;
