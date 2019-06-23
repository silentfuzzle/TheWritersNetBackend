const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
    bookid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    displaytitle: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: true
    }
});

var Sections = mongoose.model('Section', sectionSchema);

module.exports = Sections;