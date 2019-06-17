const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
    pageid: {
        type: String,
        required: true
    },
    sectionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    },
    position: {
        type: Number,
        min: 1
    }
});

var Positions = mongoose.model('Position', positionSchema);

module.exports = Positions;