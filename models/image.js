var mongoose = require("mongoose"), Schema = mongoose.Schema;
var image = new Schema({
	id: String,
	url: String, 
	tags: [],
	date: Date
});


module.exports = mongoose.model("Image",image);