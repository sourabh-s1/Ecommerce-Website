const express = require("express");
const router = express.Router();

const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");

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

    sendToken(user, 200, res);
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
});

router.get("/me", isAuthenticatedUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
});

//Update user password
router.put("/password/update", isAuthenticatedUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    //if password does not match
    if (!isPasswordMatch) {
      return next(new ErrorHandler("old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password mismatch", 400));
    }

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
});

//update user profile
router.put("/me/update", isAuthenticatedUser, async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    //We will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
});


//Get all users(Admin)
router.get('/allusers', isAuthenticatedUser, authorizedRoles("admin"), async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    })
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
})


//get single user (Admin)
router.get('/allusers/:id', isAuthenticatedUser, authorizedRoles("admin"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if(user == null) {
      return next(new ErrorHandler(`User not found with id ${req.params.id}`,400))
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
})


//To update user (Admin)
router.put("/update/:id", isAuthenticatedUser, async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    //We will add cloudinary later

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if(user == null) {
      return next(new ErrorHandler(`User not found with id ${req.params.id}`,400))
    }

    res.status(200).json({
      success: true,
      message: "User update successfully!"
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
});


//Delete user (Admin)
router.delete("/delete/:id", isAuthenticatedUser, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if(user == null) {
      return next(new ErrorHandler(`User not found with id ${req.params.id}`,400))
    }

    res.status(200).json({
      success: true,
      user,
      message: 'User deleted successfully!'
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
});
module.exports = router;
