const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    displayname: {
        type: String,
        default: ''
    },
    sqlid: {
        type: Number,
        default: 0
    }
});

userSchema.plugin(passportLocalMongoose);
var Users = mongoose.model('BareUser', userSchema);

module.exports = Users;