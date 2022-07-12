const { Router } = require("express");
const auth = require("../middlewares/auth");
const bankController = require("../controllers/bankController");

const router = Router();
router.use(auth);

router
  .route("/")
  .get(bankController.getBankDetails)
  .post(bankController.addBankDetails);
router.route("/:id").delete(bankController.deleteBankDetails);

module.exports = router;
