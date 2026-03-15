const router = require("express").Router();
const Messages = require("../model/messageModel");
const mongoose = require("mongoose");
const User = require("../model/userModel");

///message

router.post("/addmsg/", async (req, res) => {
  try {
    const { from, to } = req.body;
    const messageText =
      typeof req.body.messages === "string" ? req.body.messages : req.body.message;

    if (!from || !to || !messageText) {
      return res.status(400).send({
        success: false,
        message: "from, to and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id provided",
      });
    }

    const data = await Messages.create({
      message: {
        text: messageText.trim(),
      },
      users: [from, to],
      sender: from,
    });

    if (!data) {
      return res.status(500).send({
        success: false,
        message: "Failed to add message to database",
      });
    }

    return res.status(201).send({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


router.get("/getmsg", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).send({
        success: false,
        message: "from and to query params are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id provided",
      });
    }

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      }
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt,
      };
    });

    return res.status(200).send(projectMessages);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id provided",
      });
    }

    const messages = await Messages.find({
      users: userId,
    }).sort({ updatedAt: -1 });

    const seenConversationUsers = new Set();
    const conversationSeeds = [];

    for (const message of messages) {
      const otherUserId = message.users.find(
        (participantId) => participantId.toString() !== userId
      )?.toString();

      if (!otherUserId || seenConversationUsers.has(otherUserId)) {
        continue;
      }

      seenConversationUsers.add(otherUserId);
      conversationSeeds.push({
        otherUserId,
        lastMessage: message.message.text,
        updatedAt: message.updatedAt,
        fromSelf: message.sender.toString() === userId,
      });
    }

    if (!conversationSeeds.length) {
      return res.status(200).send([]);
    }

    const users = await User.find({
      _id: { $in: conversationSeeds.map((conversation) => conversation.otherUserId) },
    }).select([
      "_id",
      "username",
      "avatarImage",
      "about",
      "lastSeen",
      "settings.lastSeenVisibility",
    ]);

    const userMap = new Map(users.map((user) => [user._id.toString(), user]));
    const conversations = conversationSeeds
      .map((conversation) => {
        const user = userMap.get(conversation.otherUserId);
        if (!user) {
          return null;
        }

        return {
          _id: user._id,
          username: user.username,
          avatarImage: user.avatarImage,
          about: user.about,
          lastSeen: user.lastSeen,
          settings: user.settings,
          lastMessage: conversation.lastMessage,
          updatedAt: conversation.updatedAt,
          fromSelf: conversation.fromSelf,
        };
      })
      .filter(Boolean);

    return res.status(200).send(conversations);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
