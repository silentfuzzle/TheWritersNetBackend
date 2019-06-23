const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    displayname: {
        type: String,
        required: true
    },
    bookid: {
        type: String,
        required: true
    },
    booktitle: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        default: ''
    },
    review: {
        type: String,
        default: ''
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

var Reviews = mongoose.model('Review', reviewSchema);

module.exports = Reviews;