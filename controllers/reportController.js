const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const Report = require("../models/reportModel");
const User = require("../models/userModel");

module.exports = {
  /**
   * @function getAllReports
   * @route /api/v1/reports/getAllReports/:id
   * @method GET
   */
  getAllReports: catchAsync(async (req, res, next) => {
    const reports = await Report.find({
      sellerId: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: reports,
    });
  }),
  /**
   * @function getReport
   * @route  /api/v1/reports/:id
   * @method GET
   */
  getReport: catchAsync(async (req, res, next) => {
    const report = await Report.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: report,
    });
  }),
  /**
   * @function createReport
   * @route  /api/v1/reports
   * @method POST
   */
  createReport: catchAsync(async (req, res, next) => {
    const newReport = await Report.create({
      sellerId: req.body.sellerId,
      buyerId: req.user._id,
      orderId: req.body.orderId,
      message: req.body.message,
    });

    const user = await User.findById(req.body.sellerId);
    user.reports = user.reports + 1;
    user.save();

    res.status(200).json({
      status: "success",
      data: newReport,
    });
  }),
  /**
   * @function deleteReport
   * @route  /api/v1/reports
   * @method DELETE
   */
  deleteReport: catchAsync(async (req, res, next) => {
    await Report.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
    });
  }),
};
