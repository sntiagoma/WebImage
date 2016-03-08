var mongoose = require('mongoose');

module.exports = mongoose.model("Image",{
    originalname: String,
    encoding: String,
    mimetype: String,
    filename: String,
    size: Number,
    date: {
        type:Date,
        default: new Date()
    },
    user: String
});