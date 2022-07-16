const { Router } = require("express");
const auth = require("../middlewares/auth");
const conversationController = require("../controllers/conversationController");

const router = Router();

router.use(auth);

router
  .route("/")
  .post(conversationController.createConversation)
  .get(conversationController.getAllConversations);
module.exports = router;
