const Conversation = require("../models/conversationModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
module.exports = {
  /**
   * @function createConversation
   * @route /api/v1/conversations
   * @method POST
   */
  createConversation: catchAsync(async (req, res, next) => {
    const newConversation = await Conversation.create({
      members: [req.user._id, req.body.receiverId],
    });
    res.status(200).json({
      status: "success",
      data: newConversation,
    });
  }),
  /**
   * @function getAllConversation
   * @route /api/v1/conversations
   * @method GET
   */
  getAllConversations: catchAsync(async (req, res, next) => {
    const conversation = await Conversation.find({
      members: { $in: [req.user._id] },
    });
    res.status(200).json({
      status: "success",
      data: conversation,
    });
  }),
};
