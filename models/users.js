var mongoose = require("mongoose"), Schema = mongoose.Schema;
var user = new Schema({
    username: String,
    password: String,
    images: [],
    email: String,
    gender: {
    	type: String,
    	enum: ['male', 'female', 'other']
    }
});

module.exports = mongoose.model("User",user);