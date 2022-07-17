const Message = require("../models/messageModel");
const ChatImage = require("../models/chatImageModel");
const Token = require("../models/tokenModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const FireBaseService = require("../services/firebase");
const cloudinary = require("../services/cloudinary");
module.exports = {
  /**
   * @function sendMessage
   * @route /api/v1/messages
   * @method POST
   */
  sendMessage: catchAsync(async (req, res, next) => {
    const savedAccountToken = await Token.findOne({
      userId: req.body.receiverId,
    });

    const fcmDeviceToken = savedAccountToken.fcmToken;

    const newMessage = await Message.create({
      conversationId: req.body.conversationId,
      senderId: req.user._id,
      type: req.body.type,
      message: req.body.message,
      imageUrl: req.body.imageUrl,
    });

    let fcmData;
    if (req.body.type === "text") {
      fcmData = {
        type: req.body.type,
        message: req.body.message,
        time: `${Date.now()}`,
      };
    } else {
      fcmData = {
        type: req.body.type,
        imageUrl: req.body.imageUrl,
        time: `${Date.now()}`,
      };
    }

    const fcmNotification = {
      title: "New message",
      body: `You have a message from ${req.user.firstName}  ${req.user.lastName}`,
    };

    FireBaseService.sendSingleMessage(fcmDeviceToken, fcmData, fcmNotification);

    res.status(200).json({
      status: "success",
      data: newMessage,
    });
  }),
  /**
   * @function getAllMessage
   * @route /api/v1/messages/:id
   * @method GET
   */
  getAllMessages: catchAsync(async (req, res, next) => {
    const messages = await Message.find({
      conversationId: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: messages,
    });
  }),
  /**
   * @function getImageUrl
   * @route /api/v1/messages/getImageUrl
   * @method POST
   */
  getImageUrl: catchAsync(async (req, res, next) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      null,
      {
        folder: "TB_ChatImage",
      }
    );

    const data = await ChatImage.create({
      conversationId: req.body.conversationId,
      pulicId: public_id,
      imageUrl: secure_url,
    });

    res.status(200).json({
      status: "success",
      data: data.imageUrl,
    });
  }),
};
