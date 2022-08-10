const mongoose = require("mongoose");
const webhookSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Webhook = mongoose.model("Webhook", webhookSchema);

module.exports = Webhook;
