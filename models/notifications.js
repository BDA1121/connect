var mongoose = require("mongoose");

var notificationsschema = new mongoose.Schema({
	username: String,
	creator : String,
	type    : String,
	caller  : String,
	status  : String,
	group   : Array
}); 
module.exports = mongoose.model("Notification", notificationsschema);
