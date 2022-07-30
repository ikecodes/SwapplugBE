const FireBaseService = require("../services/firebase");
const Token = require("../models/tokenModel");

exports.sendToOne = async (userId, type, message, title) => {
  try {
    const savedAccountToken = await Token.findOne({
      userId: userId,
    });
    const deviceToken = savedAccountToken.fcmToken;

    const fcmData = {
      type: type,
      message: message,
      time: `${Date.now()}`,
    };
    const fcmNotification = {
      title: title,
      body: message,
    };
    FireBaseService.sendSingleMessage(deviceToken, fcmData, fcmNotification);
  } catch (error) {
    console.log(error);
  }
};
