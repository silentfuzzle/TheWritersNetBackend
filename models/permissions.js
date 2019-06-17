const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    bookid: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    displayname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    permissionid: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    }
});

var Permissions = mongoose.model('Permission', permissionSchema);

module.exports = Permissions;