'use strict';

module.exports = app => {
    const users = require('../controllers/user_controller'),
            jwt = require('jsonwebtoken');

    // Jwt gate
    const jwt_check = (req, res, next) => {

        if (req.path === '/users/signin') return next();
        if (req.path.includes('/registration/')) return next();
        if (req.path === '/users') return next();

        if (!req.get('jwt'))
            return res.status(401).json({
                message: 'Not authorised'
            });

        const verified = jwt.verify(req.get('jwt'), process.env.JWT_KEY);

        if (verified)
            return next();
        else
            return res.status(401).json({
                message: 'Not authorised'
            });
    };

    const allowCrossDomain = (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    };

    app.use(allowCrossDomain);

    app.all('*', jwt_check);

    //User routes
    app.route('/users')
        .get(users.list_all_users)
        .post(users.create_a_user);

    app.route('/users/:userId')
        .get(users.find_user_by_id);
        // .put(users.update_a_user)
        // .delete(users.delete_a_user);

    app.route('/users/signin')
        .post(users.authenticate_a_user);

    app.route('/registration/:token')
        .get(users.verify_and_redirect);
};

