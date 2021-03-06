//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose"),
    User = require('../api/models/users'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    jwt = require('jsonwebtoken'),
    server = require('../server'),
    should = chai.should();

chai.use(chaiHttp);

//Our parent block

describe('Users', () => {
    const auth_user = {
        email: 'test@test.com',
        firstName: 'tester1',
        secondName: 'of the test',
        password: 'password1'
    };

    let jwt_token;
    const secret_key = process.env.JWT_KEY;

    beforeEach((done) => { //Before each test we empty the database
        User.remove({ email: 'test@test.com' }, (err) => {
            done();
        });

        jwt_token = jwt.sign({ user: auth_user }, secret_key, { expiresIn: 3600 })
    });

    /*
    * Test the /GET route
    */
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/users')
                .set('jwt', jwt_token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST users', () => {
        it('should POST a valid user', (done) => {
            let user = {
                email: 'test@test.com',
                firstName: 'tester1',
                secondName: 'of the test',
                password: 'password1'
            };

            chai.request(server)
                .post('/users')
                .send(user)
                .set('jwt', jwt_token)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.user.should.have.property('email').eql('test@test.com');
                    res.body.user.should.have.property('firstName').eql('tester1');
                    res.body.user.should.have.property('secondName').eql('of the test');
                    res.body.user.should.have.property('isVerified').eql(false);
                    res.body.user.should.have.property('password').but.not.equal('password1');
                    res.body.should.have.property('message').eql('User successfully added!');
                    done();
                });
        });
        it('should not accept a user without a second name', (done) => {
            let user = {
                email: 'test@test.com',
                firstName: 'test1',
                secondName: '',
                password: 'password1'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .set('jwt', jwt_token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('secondName');
                    res.body.errors.secondName.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('should not accept a user without a first name', (done) => {
            let user = {
                email: 'test@test.com',
                firstName: '',
                secondName: 'of the test',
                password: 'password1'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .set('jwt', jwt_token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('firstName');
                    res.body.errors.firstName.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('should not accept a user without an email', (done) => {
            let user = {
                email: '',
                firstName: 'test1',
                secondName: 'of the test',
                password: 'password1'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .set('jwt', jwt_token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email');
                    res.body.errors.email.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('should not accept a user without a password', (done) => {
            let user = {
                email: 'test@test.com',
                firstName: 'test1',
                secondName: 'of the test',
                password: ''
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .set('jwt', jwt_token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password');
                    res.body.errors.password.should.have.property('kind').eql('required');
                    done();
                });
        });
    });
    /*
    * Test the signin /POST route
    */
    describe('/POST users/signin', () => {
        it('should return 401 if email not found', (done) => {
            let user = {
               email: 'i do not exist',
               password: 'password1'
            };
            chai.request(server)
                .post('/users/signin')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Authentication failed1');
                    done();
                });
        });
        it('should return 401 if email found but password invalid', (done) => {
            let user = {
                email: 'test2@test.com',
                password: 'invalid'
            };
            chai.request(server)
                .post('/users/signin')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Authentication failed3');
                    done();
                });
        });
        it('should return 200 if email and password valid', (done) => {
            let user = {
                email: 'test2@test.com',
                password: 'password1'
            };
            chai.request(server)
                .post('/users/signin')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('jwt');
                    res.body.should.have.property('userId').eql('59a84c7d8f603bd8f1127ab3');
                    res.body.should.have.property('message').eql('Authenticated');
                    done();
                });
        });
    });

    /*
    * Test the registration /GET route
    */
    describe('/GET registration/:token', () => {
        it('should redirect to token invalid splash screen if token invalid', (done) => {
            chai.request(server)
                .get('/registration/123')
                .redirects(0)
                .end((err, res) => {
                    res.should.redirectTo('http://127.0.0.1:4200/register/failure');
                    done();
                });
        });
        it('should redirect to token invalid splash screen if user not found', (done) => {
            const test_token = jwt.sign({ id: 'wrongid' }, secret_key, { expiresIn: 3600 });
            chai.request(server)
                .get(`/registration/${test_token}`)
                .redirects(0)
                .end((err, res) => {
                    res.should.redirectTo('http://127.0.0.1:4200/register/failure');
                    done();
                });
        });
        it('should redirect to login page if token valid and user exists', (done) => {
            const test_token = jwt.sign({ id: '59a84c7d8f603bd8f1127ab3' }, secret_key, { expiresIn: 3600 });
            chai.request(server)
                .get(`/registration/${test_token}`)
                .redirects(0)
                .end((err, res) => {
                    res.should.redirectTo('http://127.0.0.1:4200/register/success');
                    done();
                });
        });
    });

    describe('/PUT users', () => {
        const randomNumber = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

        it('should update a users email if userId is a header and only email posted and respond with updated user', (done) => {
            let putData = {
                email: `test${randomNumber}@test.com`
            };

            chai.request(server)
                .put('/users')
                .send(putData)
                .set('userId', '59b95fa369a077c0dc0a2719')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName').eql('tester3');
                    res.body.should.have.property('secondName').eql('of the test');
                    res.body.should.have.property('email').eql(`test${randomNumber}@test.com`);
                    done();
                });
        });

        it('should return 401 if userId header is not set', (done) => {
            let putData = {
                email: `test${randomNumber}@test.com`
            };

            chai.request(server)
                .put('/users')
                .send(putData)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
    // todo add tests to verify isVerified flag defaults to false, and validating via email turns it to true
});