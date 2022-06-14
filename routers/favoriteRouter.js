const { Router } = require("express");
const auth = require("../middlewares/auth");
const favoriteController = require("../controllers/favoriteController");

const router = Router();

router.use(auth);

router.route("/").get(favoriteController.getAllFavorites);
router.route("/:id").post(favoriteController.createFavorite);
router.route("/:id").delete(favoriteController.deleteFavorite);
module.exports = router;
