const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema({
	username: String,
	password: String,
	role: String
}),
	Users = mongoose.model('user', userSchema);

module.exports = Users;