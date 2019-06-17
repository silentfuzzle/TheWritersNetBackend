const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    bookid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

var Pages = mongoose.model('Page', pageSchema);

module.exports = Pages;