var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PicSchema = new Schema({
	userId: String,
	title: String,
	time: String,
	pic: String,
	meta: String
});

var Pic = mongoose.model('Pic', PicSchema);

module.exports = Pic;