var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PasswordSchema = new Schema({
	id: String,
	token: String
});

var Password = mongoose.model('Password', PasswordSchema);

module.exports = Password;