const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// the admin schema
const AdminSchema = new mongoose.Schema({
	firstName: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide firstName"],
		trim: true
	},
	lastName: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide lastName"],
		trim: true
	},
	country: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide your country"],
		trim: true
	},
	city: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide your city"],
		trim: true
	},
	position: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide your position at Afrex Bridge Connections"],
		trim: true
	},
	telephone: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide telephone"],
		unique: true,
		trim: true
	},
	email: {
		type: String,
		minlength: [5, "This field requires a minimum of 5 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide an email"],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		minlength: [5, "This field requires a minimum of 5 characters"],
		maxlength: [1500, "This field requires a minimum of 1500 characters"],
		required: [true, "Please provide password"],
	},
	resetPasswordToken : String,
	resetPasswordExpiry : Date
}, {timestamps: true})

// hashing the password
AdminSchema.pre("save", async function(next) {
	if(!this.isModified("password")){
		return next()
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// comparing password
AdminSchema.methods.comparePasswords = async function(password){
	return await bcrypt.compare(password, this.password)
}

// generating jwt auth token
AdminSchema.methods.genAuthToken = function(){
	return jwt.sign(
		{id: this._id},
		process.env.JWT_SECRET,
		{expiresIn: process.env.JWT_EXPIRY}
	)
}

// generating jwt reset token
AdminSchema.methods.genResetToken = function(){
	const resetAdminToken = crypto.randomBytes(15).toString("hex")

	// saving the hashed version of reset token to the database
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetAdminToken)
		.digest("hex")
	
	// seting the duration of the token
	this.resetPasswordExpiry = Date.now() + 30 * (60 * 1000)

	return resetAdminToken
}

// the model
const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin