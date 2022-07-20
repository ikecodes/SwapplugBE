const { Router } = require("express");
const auth = require("../middlewares/auth");
const reportController = require("../controllers/reportController");

const router = Router();

router.use(auth);
router.route("/getAllReports/:id").get(reportController.getAllReports);
router.route("/:id").get(reportController.getReport);
router.route("/").post(reportController.createReport);
router.route("/:id").delete(reportController.deleteReport);
module.exports = router;
