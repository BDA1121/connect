var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");;

var userschema = new mongoose.Schema({
	username : String,
	password : String,
	type     : String,
	status   : {
		type: String,
		default: "offline",
	} ,
	img      : {
		type: String,
		default: "/images/dp.jpg",
	}
});
userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userschema);
