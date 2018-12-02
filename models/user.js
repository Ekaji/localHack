const mongoos = require('mongoose');
mongoos.Promise = global.Promise;

const UserSchema = new mongoos.Schema({
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateUpdate: {
        type: Date
    }
})

module.exports = mongoose.module('User', UserSchema, 'User');