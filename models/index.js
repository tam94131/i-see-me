var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/i-see-me");

module.exports.Password = require("./password.js");
module.exports.Profile = require("./profile.js");
module.exports.Pic = require("./pic.js");
