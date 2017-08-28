'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true
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
    }
});

module.exports = mongoose.model('Users', UserSchema);