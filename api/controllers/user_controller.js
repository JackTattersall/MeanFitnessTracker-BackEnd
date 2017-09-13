'use strict';

const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    User = mongoose.model('Users'),
    mailer = require('../../utilities/mailer');


exports.list_all_users = (req, res) => {
    let query = {};
    let projections = {};
    let options = {sort: {secondName: 1 }};

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
                firstName: user.firstName,
                secondName: user.secondName,
            });
    });
};

exports.find_user_by_id = (req, res) => {

    User.findById(req.params.userId, (err, user) => {
        if (err)
            res.status(400).send(err);
        else
            res.status(200).json({
                firstName: user.firstName,
                secondName: user.secondName,
                email: user.email
            });
    });
};

exports.create_a_user = (req, res) => {
    const new_user = new User(req.body);

    if (new_user.password)
        new_user.password = bcrypt.hashSync(new_user.password, 10);

    new_user.save((err, user) => {
        if (err) {
            if (err.code === 11000) {
                return res.status(400).json({ message: 'Account with this email already exists'});
            }
            else {
                return res.status(400).json(err);
            }
        }
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
            return res.status(401).json(JSON.stringify(err));
        if (!user)
            return res.status(401).json({
                message: 'Authentication failed1'
            });
        if (!user.isVerified)
            return res.status(401).json({
                message: 'Authentication failed2'
            });
        if (!bcrypt.compareSync(req.body.password, user.password))
            return res.status(401).json({
                message: 'Authentication failed3'
            });

        const token = jwt.sign({ user: user }, process.env.JWT_KEY, { expiresIn: 3600 });
        return res.status(200).json({
            message: 'Authenticated',
            jwt: token,
            userId: user.id,
            firstName: user.firstName,
            secondName: user.secondName,
            email: user.email
        })
    });
};

exports.update_a_user = (req, res) => {
    const body = req.body;

    if (body.password) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    if (req.headers.userid) {
        User.findByIdAndUpdate(req.headers.userid, { $set: body }, { new: true }, (err, user) => {
            if (err) {
                return res.status(401).json(JSON.stringify(err));
            }
            else {
                console.log(user);
                return res.status(200).json({
                    email: user.email,
                    firstName: user.firstName,
                    secondName: user.secondName
                });
            }
        });
    }

    else {
        return res.sendStatus(401).json({
            message: 'Authentication failed4'
        });
    }
};

exports.verify_and_redirect = (req, res) => {

    jwt.verify(req.params.token, process.env.JWT_KEY, (err, decoded) => {
        if (err)
            return res.redirect('http://127.0.0.1:4200/register/failure');
        else
            User.findByIdAndUpdate(decoded.id, { isVerified: true }, (err, user) => {
                if (err)
                    return res.redirect('http://127.0.0.1:4200/register/failure');
                else
                    return res.redirect('http://127.0.0.1:4200/register/success');
            })
    });
};