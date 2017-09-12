'use strict';

const jwt = require('jsonwebtoken');

exports.jwt_check = (req, res, next) => {

    if (req.path === '/users/signin') return next();
    if (req.path.includes('/registration/')) return next();
    if (req.path === '/users') return next();
    if (req.path === '/verified') return next();

    if (!req.get('jwt'))
        return res.status(401).json({
            message: 'Not authorised'
        });


    jwt.verify(req.get('jwt'), process.env.JWT_KEY, (err, decoded) => {
        if (decoded) {
            return next()
        }
        if (err) {
            return res.status(401).json({
                message: 'Not authorised'
            });
        }
    });
};

exports.allowCrossDomain = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, jwt, userId");
    res.header('Access-Control-Expose-Headers', 'jwt, userId');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET');
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
};