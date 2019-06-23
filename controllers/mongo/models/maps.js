const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = require('./locations');

const mapSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    bookid: {
        type: String,
        required: true
    },
    maplinks: {
        type: String,
        default: ''
    },
    update: {
        type: Boolean,
        default: false
    },
    visitedpages: [ locationSchema ],
    currpageid: {
        type: String,
        required: true
    },
    prevhistory: [ locationSchema ],
    nexthistory: [ locationSchema ],
    percentageRead: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
});

var Maps = mongoose.model('Map', mapSchema);

module.exports = Maps;