const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    pageid: {
        type: String,
        required: true
    }
});

var Locations = mongoose.model('Location', locationSchema);

module.exports = locationSchema;