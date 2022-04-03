const express = require("express");
const router = express.Router();

const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//Create User
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "This is a sample avatar",
        url: "http://example.com",
      },
    });

    sendToken(user, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err, 404));
  }
});

//Login user
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user gave email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password"); //using select cause we defined unselect in userSchema

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  //if password does not match
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

router.get("/logout", async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()), // This will expire token instantly
      httpOnly: true,
    });

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully!" });
  } catch (err) {
    return next(new ErrorHandler(err, 404));
  }
});

//Reset User Password
router.post("/reset", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/reset/${resetToken}`;

  const message = `To reset your password please click on the link below:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, Please kindly ignore it.`;

  //if theres error in resetPassword
  try {
    await sendEmail({
      email: user.email,
      subject: `ShoppersSpot Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    });
  } catch (err) {
    //making them undefined cause of error encountered
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

//Redirected reset password link with jwtToken  
router.put("/reset/:token", async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler(
          "Reset password token is invalid or has been expired",
          404
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 404));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200, res)
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
});

module.exports = router;
