const { Router } = require("express");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const ProductController = require("../controllers/productController");
const upload = require("../services/multer");
const router = Router();

router.route("/").get(ProductController.getAllProducts);
router
  .route("/getAllProductsByUser")
  .get(auth, ProductController.getAllProductsByUser); // added auth middleware to this
router.route("/:id").get(ProductController.getProduct);

router.use(auth);
router.route("/").post(upload.array("images"), ProductController.createProduct);
router.route("/:id").delete(ProductController.deleteProduct);

module.exports = router;
