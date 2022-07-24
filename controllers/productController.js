const Product = require("../models/productModel");
const Favorite = require("../models/favoriteModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const APIFeatures = require("../helpers/apiFeatures");
const User = require("../models/userModel");
const cloudinary = require("../services/cloudinary");

module.exports = {
  /**
   * @function createProduct
   * @route /api/v1/products
   * @method POST
   */
  createProduct: catchAsync(async (req, res, next) => {
    const imagesPromises = req.files.map(async (file) => {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        null,
        { folder: "Product" }
      );
      return {
        original: secure_url,
        publicId: public_id,
      };
    });
    const images = await Promise.all(imagesPromises);

    const product = await Product.create({
      about: req.body.about,
      status: req.body.status,
      name: req.body.name,
      state: req.body.state,
      category: req.body.category,
      price: req.body.price,
      faults: req.body.faults,
      expiryDate: req.body.expiryDate,
      availableForSwap: req.body.availableForSwap,
      images: images,
      durationUsed: req.body.durationUsed,
      seller: req.user._id,
      swappableWith: req.body.swappableWith,
      quantity: req.body.quantity,
    });

    await User.findByIdAndUpdate(req.user.id, {
      posted: req.user.posted + 1,
    });

    res.status(200).json({
      status: "success",
      data: product,
    });
  }),

  getAllProducts: catchAsync(async (req, res, next) => {
    const products = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const countPromise = Product.countDocuments(queryObj); // get total number of document matching query
    const docPromise = products.query;

    const [count, doc] = await Promise.all([countPromise, docPromise]);
    const favorites = await Favorite.find({ user: req.user._id }).select(
      "product"
    );

    const filteredFavorites = favorites.map((favorite) => favorite.product.id);
    const mainProducts = doc.map((product) =>
      filteredFavorites.includes(product.id)
        ? { ...product._doc, favorite: true }
        : { ...product._doc, favorite: false }
    );
    const pageCount = Math.ceil(count / 10);
    res.status(200).json({
      status: "success",
      pagination: {
        count,
        pageCount,
      },
      data: mainProducts,
    });
  }),
  /**
   * @function getAllProductsByMe
   * @route /api/v1/products/getAllProductsByMe
   * @method GET
   */
  getAllProductsByMe: catchAsync(async (req, res, next) => {
    const products = await Product.find({
      seller: req.user._id,
    });
    res.status(200).json({
      status: "success",
      data: products,
    });
  }),
  /**
   * @function getAllProductsByUser
   * @route /api/v1/products/getAllProductsByUser/:id
   * @method GET
   */
  getAllProductsByUser: catchAsync(async (req, res, next) => {
    const products = await Product.find({
      seller: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: products,
    });
  }),
  /**
   * @function getProduct
   * @route /api/v1/products/:id
   * @method GET
   */
  getProduct: catchAsync(async (req, res, next) => {
    const product = await Product.findOne({
      _id: req.params.id,
    });

    if (!product)
      return next(new AppError("No product with this Id found", 404));
    let favorite;

    const isFavorite = await Favorite.findOne({
      user: req.user.id,
      product: req.params.id,
    });
    if (isFavorite) {
      favorite = true;
    } else {
      favorite = false;
    }
    res.status(200).json({
      status: "success",
      data: { ...product._doc, favorite },
    });
  }),
  /**
   * @function editProduct
   * @route /api/v1/products/:id
   * @method PATCH
   */
  editProduct: catchAsync(async (req, res, next) => {
    const newProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: newProduct,
    });
  }),

  /**
   * @function deleteProduct
   * @route /api/v1/products/:id
   * @method DELETE
   */
  deleteProduct: catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id });
    const deletePromises = product.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.publicId, null, {
        folder: "Product",
      });
    });
    await Promise.all(deletePromises);
    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
    });
  }),
};
