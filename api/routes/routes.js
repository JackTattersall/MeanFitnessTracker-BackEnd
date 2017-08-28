'use strict';

module.exports = app => {
    const users = require('../controllers/user_controller');

    //User routes
    app.route('/users')
        .get(users.list_all_users)
        .post(users.create_a_user);
};

