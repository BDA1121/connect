var mongoose = require("mongoose");
var chatschema = new mongoose.Schema({
	username : Array,
	password : String,
	type     : String
});
module.exports = mongoose.model("Chat", chatschema);
