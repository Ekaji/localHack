const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const wordsSchema = new mongoose.Schema({
    word: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Words', wordsSchema, 'Words');