const router = require("express").Router();
const User = require("../model/userModel");
const bycript = require("bcrypt");
// const jwt = require('jsonwebtoken'); // jwt 1


/// register
router.post("/register", async (req, res) => {
 
  try {
    const { username, email, password } = req.body;
    console.log(username);
    
    const user = await User.findOne({ username });
      const userEmail = await User.findOne({ email });
      //if username exist
    if (user) {
      return res.send({
        success: false,
        message: "User Alreay Exists",
      });
      }
    //   if email exist
    if (userEmail) {
      return res.send({
        success: false,
        message: "User Alreay Exists",
      });
    }
    //bycript password
    const hashedPassword = await bycript.hash(password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "Registration Successfull , Please login",
      res : newUser
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

///login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmailExist = await User.findOne({ email: req.body.email });

      
      //if username exist
    if (!userEmailExist) {
      return res.send({
        success: false,
        message: "User not registered",
      });
      }
      // if password valid
      const isPasswordValid = await bycript.compare(password,userEmailExist.password)
    if (!isPasswordValid) {
      return res.send({
        status: false,
        message: "invalid email password",
      });
        
      }
    //   delete userEmailExist.password;

    res.send({
      success: true,
      message: "logged-in sucessfully",
      res: userEmailExist
    });
  } catch (error) {
    res.send({
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
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.send({isSet:userData.isAvatarImageSet,image:userData.avatarImage})
  } catch (error) {
    res.send({
      message:error.messege
    })
  } 
})

///contacts
router.get("/allusers/:id", async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email", "username", "avatarImage", "_id"
    ]);
    return res.send(users)
  } catch (error) {
    return res.send(error.message)
  }
})




module.exports = router;
