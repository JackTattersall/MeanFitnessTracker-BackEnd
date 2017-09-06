'use strict';

module.exports = app => {
    const users = require('../controllers/user_controller'),
            gates = require('./gates');

    // Add gates
    app.use(gates.allowCrossDomain);
    app.all('*', gates.jwt_check);

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

