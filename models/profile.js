var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  name: String,
  userId: String,
  filter: String,
  preferences: String,
  token: String
});

var Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;