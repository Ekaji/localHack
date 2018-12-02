const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const wordsSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Words', wordsSchema, 'Words');