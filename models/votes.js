const mongoos = require('mongoose');
mongoos.Promise = global.Promise

const votesSchema = new mongoos.Schema({
    definition: {
        type: mongoos.Schema.Types.ObjectId,
        ref: 'Definition',
        required: true
    },

    voter: {
        type: mongoos.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    vote: {
        type: Number,
        required: true
    },

    dateVote: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoos.model('Votes', votesSchema, 'Votes');