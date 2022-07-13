const { Router } = require("express");
const auth = require("../middlewares/auth");
const ProductController = require("../controllers/productController");
const upload = require("../services/multer");
const router = Router();

router.use(auth);
router.route("/").get(ProductController.getAllProducts);
router.route("/getAllProductsByMe").get(ProductController.getAllProductsByMe);
router
  .route("/getAllProductsByUser/:id")
  .get(ProductController.getAllProductsByUser);
router.route("/:id").get(ProductController.getProduct);
router.route("/:id").patch(ProductController.editProduct);
router.route("/").post(upload.array("images"), ProductController.createProduct);
router.route("/:id").delete(ProductController.deleteProduct);

module.exports = router;
