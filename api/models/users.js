'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    second_name: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Users', UserSchema);