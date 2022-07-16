const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * @module firebase
 * @description provides an abstraction layer firebase services
 */
module.exports = {
  /**
   * @function sendSingleMessage
   * @description an generic API to send message to a single device
   * @param {String} deviceToken - fcmToken of target device
   * @param {Object} data - payload data
   * @param {Object} notification - payload notification
   */
  sendSingleMessage: async (deviceToken, data, notification) => {
    const message = {
      data,
      token: deviceToken,
      notification,
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  },

  /**
   * @function sendSingleMessage
   * @description an generic API to send message to a single device
   * @param {String} deviceToken - fcmToken of target device
   * @param {Object} data - payload data
   * @param {Object} notification - payload notification
   */
  sendSingleDataOnly: async (deviceToken, data) => {
    const message = {
      data,
      token: deviceToken,
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  },

  /**
   * @function sendMultiCastMessage
   * @description send message to a multiple devices
   * @param {String} deviceTokens - fcmToken of target devices
   * @param {Object} data - payload data
   * @param {Object} notification - payload notification
   */
  sendMultiCastMessage: async (deviceTokens, data, notification) => {
    const message = {
      data,
      tokens: deviceTokens,
      notification,
    };

    admin
      .messaging()
      .sendMulticast({
        tokens: message.tokens,
        notification: message.notification,
        data: message.data,
      })
      .then((response) => {
        console.log(response.successCount + " messages were sent successfully");
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });

    return;
  },
};
