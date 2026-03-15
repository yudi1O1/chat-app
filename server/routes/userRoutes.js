const router = require("express").Router();
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
// const jwt = require('jsonwebtoken'); // jwt 1

function sanitizeUser(user) {
  const userObject = user.toObject ? user.toObject() : { ...user };
  delete userObject.password;
  return userObject;
}

function getSettingsPayload(body = {}) {
  const settings = {};
  const allowedVisibility = ["everyone", "contacts", "nobody"];

  if (typeof body.about === "string") {
    settings.about = body.about.trim().slice(0, 120);
  }

  if (allowedVisibility.includes(body.lastSeenVisibility)) {
    settings["settings.lastSeenVisibility"] = body.lastSeenVisibility;
  }

  if (allowedVisibility.includes(body.profilePhotoVisibility)) {
    settings["settings.profilePhotoVisibility"] = body.profilePhotoVisibility;
  }

  if (typeof body.readReceipts === "boolean") {
    settings["settings.readReceipts"] = body.readReceipts;
  }

  if (typeof body.enterToSend === "boolean") {
    settings["settings.enterToSend"] = body.enterToSend;
  }

  if (typeof body.notifications === "boolean") {
    settings["settings.notifications"] = body.notifications;
  }

  return settings;
}

/// register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "username, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const user = await User.findOne({ username: normalizedUsername });
    const userEmail = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(409).send({
        success: false,
        message: "Username already exists",
      });
    }

    if (userEmail) {
      return res.status(409).send({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).send({
      success: true,
      message: "Registration successful, please log in",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

///login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "email and password are required",
      });
    }

    const userEmailExist = await User.findOne({ email: email.toLowerCase().trim() });

    if (!userEmailExist) {
      return res.status(404).send({
        success: false,
        message: "User not registered",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userEmailExist.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Logged in successfully",
      user: sanitizeUser(userEmailExist),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

///setAvatar 

router.post("/setavatar/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    if (!avatarImage) {
      return res.status(400).send({
        success: false,
        message: "image is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id",
      });
    }

    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    }, {
      new: true,
      runValidators: true,
    });

    if (!userData) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.send({
      success: true,
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

///contacts
router.get("/allusers/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id",
      });
    }

    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email", "username", "avatarImage", "_id", "about", "lastSeen", "settings.lastSeenVisibility"
    ]);
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

router.put("/settings/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user id",
      });
    }

    const updatePayload = getSettingsPayload(req.body);
    if (!Object.keys(updatePayload).length) {
      return res.status(400).send({
        success: false,
        message: "No valid settings provided",
      });
    }

    const user = await User.findByIdAndUpdate(userId, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});




module.exports = router;
