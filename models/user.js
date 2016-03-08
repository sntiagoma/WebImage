var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    username: String,
    password: String,
    images: [String],
    email: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    }
});