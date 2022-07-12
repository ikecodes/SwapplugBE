const Bank = require("../models/bankModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

module.exports = {
  /**
   * @function getBankDetails
   * @route /api/v1/transactions/getBankDetails
   * @method GET
   */
  getBankDetails: catchAsync(async (req, res, next) => {
    const details = await Bank.find({ userId: req.user._id });
    if (!details.length)
      return next(new AppError("you have not added any bank detail"));
    res.status(200).json({
      status: "success",
      data: details,
    });
  }),
  /**
   * @function addBankDetails
   * @route /api/v1/transactions/addBankDetails
   * @method POST
   */
  addBankDetails: catchAsync(async (req, res, next) => {
    const alreadyAdded = await Bank.findOne({
      accountNumber: req.body.accountNumber,
    });
    if (alreadyAdded)
      return next(new AppError("this bank details has already been added"));
    const details = await Bank.create({
      userId: req.user._id,
      ...req.body,
    });

    res.status(200).json({
      status: "success",
      data: details,
    });
  }),
  /**
   * @function deleteBankDetails
   * @route /api/v1/transactions/deleteBankDetails/:id
   * @method DELETE
   */
  deleteBankDetails: catchAsync(async (req, res, next) => {
    await Bank.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
    });
  }),
};
