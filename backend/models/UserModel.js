const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique:true
	}, 
	password: {
		type: String,
		required: true,
	},
	dateAdded: {
		type: Date,
		required: false,
		default: Date.now,
	},
	type: {
		type: String,
		required: true
	},
	
});

module.exports = User = mongoose.model("Users", UserSchema);
