const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
	{
		name: {
			type:String,
			required: [true, 'Please Enter your Name'],
			maxLength:[12, 'Name can not exceed 12 characters'],
			minLength:[4, 'Name should be less than 4 characters']
		},
		email: {
			type: String,
			required: [true, 'Please Enter your Email'],
			unique: true,
			validator: [validator.isEmail, "Please enter a valid email"]
		},
		password: {
			type: String,
			required: [true, 'Please Enter your Password'],
			minLength:[8,'Password must be at least 8 characters'],
			select: false, //using this to prevent showing the password
		},
		avatar: {
			public_id: {type: String, required: true},
			url: {type: String, required: true}
		},
		role: {
			type: String,
			default: 'user'
		},
		resetPasswordToken: String,
		resetPasswordExpires: Date,
	}
)

userSchema.pre("save", async function(next){

	//if password is already present and havent changed then dont need to rehash hashed password
	if(!this.isModified("password")){
		next()
	}

	this.password = await bcrypt.hash(this.password,10);
})

//JWT Token
userSchema.methods.getJWTToken = function (){
	return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRATION
	})
}

//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
	return await bcrypt.compare(enteredPassword,this.password);
}

//Genrating Reset Password Token
userSchema.methods.generateResetPasswordToken = function() {

	//Genrating token
	const resetToken = crypto.randomBytes(20).toString('hex');

	//Hashing and adding resetPassword token to userSchema
	this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

	this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

	return resetToken;

}

module.exports = mongoose.model('User', userSchema);