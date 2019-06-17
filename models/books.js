const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = require('./locations');

const linkSchema = new Schema({
    pageid: {
        type: String,
        required: true
    },
    outgoinglinks: [ locationSchema ]
});

const bookSchema = new Schema({
    startpageid: {
        type: String
    },
    ownerid: {
        type: String,
        required: true
    },
    displayname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    visibility: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
        max: 2
    },
    maplinks: [ linkSchema ],
    length: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        default: -1,
        min: -1,
        max: 5
    }
});

var Books = mongoose.model('Book', bookSchema);

module.exports = Books;