var mongoose = require("mongoose");

var chatschema = new mongoose.Schema({
	users : String,
	chat     : [{Author:String, Chat:String}],
});
module.exports = mongoose.model("Chat", chatschema);
