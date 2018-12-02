const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const definitionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    word: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Words',
        required: true,
    },

    defined: {
        type: String,
        required: true
    },

    dateCreated: {
        type: Date,
        default: Date.now
    },

    dateUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Definition', definitionSchema, 'Definition');