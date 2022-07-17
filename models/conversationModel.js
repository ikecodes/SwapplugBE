const mongoose = require("mongoose");
const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "members",
    select: "photo firstName lastName",
  }).populate("orderId");

  next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
