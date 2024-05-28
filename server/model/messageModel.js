const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array, 
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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










