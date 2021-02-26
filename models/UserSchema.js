const { Schema, model } = require("mongoose");

const User = new Schema({
	username: String,
	password: String,
	email: String,
	createAt: String,
});

module.exports = model("users", User);
