'use strict';

const mongoose = require('mongoose'),
    User = mongoose.model('Users');


exports.list_all_users = (req, res) => {
    let query = {};
    let projections = {};
    let options = {sort: {second_name: 1 }};

    User.find(query, projections, options, (err, user) => {
        if (err)
            res.send(err);
        res.json(user);
    });
};

exports.create_a_user = (req, res) => {
    const new_user = new User(req.body);
    new_user.save((err, user) => {
        if (err)
            res.send(err);
        res.json(user);
    });
};