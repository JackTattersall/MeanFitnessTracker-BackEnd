'use strict';

const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    User = mongoose.model('Users'),
    mailer = require('../../utilities/mailer');


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

exports.find_user_by_email = (req, res) => {
    let user = new User(req.body);
    const email = user.email;

    User.findOne({ email: email }, (err, user) => {
        if (err)
            res.status(400).send(err);
        else
            res.status(200).json({
                first_name: user.first_name,
                second_name: user.second_name,
            });
    });
};

exports.find_user_by_id = (req, res) => {

    User.findById(req.params.userId, (err, user) => {
        if (err)
            res.status(400).send(err);
        else
            res.status(200).json({
                first_name: user.first_name,
                second_name: user.second_name,
            });
    });
};

exports.create_a_user = (req, res) => {
    const new_user = new User(req.body);

    if (new_user.password)
        new_user.password = bcrypt.hashSync(new_user.password, 10);

    new_user.save((err, user) => {
        if (err)
            return res.send(err);
        else
            mailer.send_mail(user.email, jwt.sign({id: user.id}, process.env.JWT_KEY, {expiresIn: 14400}));

            return res.status(201).json({
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

        const token = jwt.sign({ user: user }, process.env.JWT_KEY, { expiresIn: 3600 });
        res.status(200).json({
            message: 'Authenticated',
            jwt: token,
            user_id: user.id
        })
    });
};

exports.verify_and_redirect = (req, res) => {

    let token = req.params.token;

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err)
            return res.redirect('token expired splash screen');
        else
            User.findByIdAndUpdate(decoded.id, { is_verified: true }, (err, user) => {
                if (err)
                    return res.status(500);
                else
                    return res.redirect('angular root url here');
            })
    });
};