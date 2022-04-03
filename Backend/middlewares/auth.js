const ErrorHandler = require("../utils/errorhandler");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticatedUser = async (req, res, next) => {
	try {
		const {token} = req.cookies;

		//console.log(token,"token");
		if(token == false) {
			return new ErrorHandler("Please login to access this page",401)
		}

		const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

		req.user = await User.findById(decodedData.id);

		next();
	}catch(err) {
		res.status(404).json({success: false, message: "Please login to access this page"});
	}
}

const authorizedRoles = (...roles) => {
	return (req, res, next) => {
		//This will check if admin contains in the req roles array
		if(!roles.includes(req.user.role)){
			return next(
				new ErrorHandler(`Role: ${req.user.role} is not authorized to access this resource`,403)
			)
		}

		next();
	}

}

module.exports = {isAuthenticatedUser,authorizedRoles}