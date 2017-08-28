'use strict';

const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    User = mongoose.model('Users');


exports.list_all_users = (req, res) => {
    let query = {};
    let projections = {};
    let options = {sort: {second_name: 1 }};

    User.find(query, projections, options, (err, user) => {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

exports.create_a_user = (req, res) => {
    const new_user = new User(req.body);

    if (new_user.password)
        new_user.password = bcrypt.hashSync(new_user.password, 10);

    new_user.save((err, user) => {
        if (err)
            res.send(err);
        else
            res.status(201).json({
                message: 'User successfully added!',
                user
            });
    });
};

exports.authenticate_a_user = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err)
            return res.send(err);
        if (!user)
            return res.status(401).json({
                message: 'Authentication failed'
            });
        if(!bcrypt.compareSync(req.body.password, user.password))
            return res.status(401).json({
                message: 'Authentication failed'
            });

        const token = jwt.sign({ user: user }, 'secret_key', { expiresIn: 3600 })
        res.status(200).json({
            message: 'Authenticated',
            user_id: user.id
        })
    });
};