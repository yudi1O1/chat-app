const router = require("express").Router();
const Messages = require("../model/messageModel");

///message

router.post("/addmsg/", async (req, res) => {
  console.log(8);
  try {
    const { from, to, messages } = req.body;
    const data = await Messages.create({
      message: {
        text: messages,
      },
      users: [from,to],
      sender: to,
    });
    if (data)
      return res.send({
        message: "messege sent successfully",
      });
    return res.send({ message: "failed to add message to database" });
  } catch (error) {
    return res.send({
      messege: error.message,
    });
  }
});


router.get("/getmsg", async (req, res) => {
  try {
    // Extracting parameters from query instead of body
    const { from, to } = req.query;
    console.log(from, to);

    // Ensure to await the find operation
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      }
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === to,
        message: msg.message.text,
      };
    });

    res.send(projectMessages);
  } catch (error) {
    return res.send({
      message: error.message
    });
  }
});

module.exports = router;
