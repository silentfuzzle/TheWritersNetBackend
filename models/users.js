const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    displayname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    facebook: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    youtube: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    }
});

var Users = mongoose.model('User', userSchema);

module.exports = Users;