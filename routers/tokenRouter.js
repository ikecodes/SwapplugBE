const { Router } = require("express");
const auth = require("../middlewares/auth");
const tokenController = require("../controllers/tokenController");

const router = Router();
router.use(auth);

router
  .route("/")
  .get(tokenController.getFCMToken)
  .post(tokenController.saveFCMToken);

module.exports = router;
