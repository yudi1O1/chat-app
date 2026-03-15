const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 2,
        message: "A message must contain exactly two users",
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
  // {
  //   message: String,
  //   sender: String,
  //   reciver:String
  // }
);

module.exports = mongoose.model("Messages", messageSchema);










