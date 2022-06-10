const Product = require("../models/productModel");
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
        thumbnail: secure_url,
        publicId: public_id,
      };
    });
    const images = await Promise.all(imagesPromises);

    const product = await Product.create({
      title: req.body.title,
      type: req.body.type,
      category: req.body.category,
      bathrooms: req.body.bathrooms,
      bedrooms: req.body.bedrooms,
      toilets: req.body.toilets,
      size: req.body.size,
      state: req.body.state,
      region: req.body.region,
      location: req.body.location,
      price: req.body.price,
      description: req.body.description,
      specialFeatures: req.body.specialFeatures,
      furnished: req.body.furnished,
      newlyBuilt: req.body.newlyBuilt,
      images: images,
      agent: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id, {
      totalListings: req.user.totalListings + 1,
      posted: req.user.posted + 1,
    });

    res.status(200).json({
      status: "success",
      data: product,
    });
  }),

  getAllProducts: catchAsync(async (req, res, next) => {
    const products = new APIFeatures(
      Product.find({ isVerified: { $ne: false } }),
      req.query
    )
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

    const pageCount = Math.ceil(count / 10);
    // return console.log(doc);
    res.status(200).json({
      status: "success",
      pagination: {
        count,
        pageCount,
      },
      data: doc,
    });
  }),
  /**
   * @function getAllProductsByUser
   * @route /api/v1/products/getAllProductsByUser
   * @method GET
   */
  getAllProductsByUser: catchAsync(async (req, res, next) => {
    const products = await Product.find({
      agent: req.user._id,
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
      isVerified: { $ne: false },
    });

    if (!product)
      return next(new AppError("No product with this Id found", 404));

    res.status(200).json({
      status: "success",
      data: product,
    });
  }),

  /**
   * @function deleteProduct
   * @route /api/v1/products
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
