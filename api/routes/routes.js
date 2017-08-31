'use strict';

module.exports = app => {
    const users = require('../controllers/user_controller');

    //User routes
    app.route('/users')
        .get(users.list_all_users)
        .post(users.create_a_user);

    app.route('/users/:userId')
        .get(users.find_user_by_id);
        // .put(users.update_a_user)
        // .delete(users.delete_a_user);

    app.route('/users/signin')
        .post(users.authenticate_a_user)
};

