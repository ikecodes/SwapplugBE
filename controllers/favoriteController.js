const Favorite = require("../models/favoriteModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
module.exports = {
  /**
   * @function getAllFavorites
   * @route /api/v1/favorites
   * @method GET
   */
  getAllFavorites: catchAsync(async (req, res, next) => {
    const favorites = await Favorite.find({ user: req.user._id });
    res.status(200).json({
      status: "success",
      data: favorites,
    });
  }),
  /**
   * @function createFavorite
   * @route /api/v1/favorites
   * @method POST
   */
  createFavorite: catchAsync(async (req, res, next) => {
    const alreadyInFavorites = await Favorite.findOne({
      user: req.user.id,
      product: req.params.id,
    });
    if (alreadyInFavorites)
      return next(new AppError("Product already in favorites", 403));

    const newFavorite = await Favorite.create({
      user: req.user.id,
      product: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: newFavorite,
    });
  }),

  /**
   * @function deleteFavorite
   * @route /api/v1/favorites/:id
   * @method DELETE
   */
  deleteFavorite: catchAsync(async (req, res, next) => {
    await Favorite.deleteOne({ _id: req.params.id, user: req.user._id });
    res.status(204).json({
      status: "success",
      message: "successfully removed cart",
    });
  }),
};
