var mongoose = require("mongoose"), Schema = mongoose.Schema;
var bill = new Schema({
    date: Date,
    seller: String,
    medium: {
        type: String,
        enum: ['Online','Store','ThirdStore','Telephone']
    }
});

module.exports = mongoose.model("Bill",bill);