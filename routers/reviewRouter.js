const { Router } = require("express");
const auth = require("../middlewares/auth");
const ReviewController = require("../controllers/reviewController");

const router = Router();

// router.route("/").get(ProductController.getAllProducts);

router.use(auth);
router.route("/:id").get(ReviewController.getAllReviews);
router.route("/").post(ReviewController.createReview);
router.route("/:id").delete(ReviewController.deleteReview);
module.exports = router;
