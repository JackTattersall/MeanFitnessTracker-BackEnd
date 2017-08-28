//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose"),
    User = require('../api/models/users'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should(),
    MongoUser = mongoose.model('Users');

chai.use(chaiHttp);

//Our parent block

describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    /*
    * Test the /GET route
    */
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
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
                first_name: 'tester1',
                second_name: 'of the test',
                password: 'password1'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.user.should.have.property('email').eql('test@test.com');
                    res.body.user.should.have.property('first_name').eql('tester1');
                    res.body.user.should.have.property('second_name').eql('of the test');
                    res.body.user.should.have.property('password').but.not.equal('password1');
                    res.body.should.have.property('message').eql('User successfully added!');
                    done();
                });
        });
        it('should not accept a user without a second name', (done) => {
            let user = {
                email: 'test@test.com',
                first_name: 'test1',
                second_name: '',
                password: 'password1'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('second_name');
                    res.body.errors.second_name.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('should not accept a user without a first name', (done) => {
            let user = {
                email: 'test@test.com',
                first_name: '',
                second_name: 'of the test',
                password: 'password1'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('first_name');
                    res.body.errors.first_name.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('should not accept a user without an email', (done) => {
            let user = {
                email: '',
                first_name: 'test1',
                second_name: 'of the test',
                password: 'password1'
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
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
                first_name: 'test1',
                second_name: 'of the test',
                password: ''
            };
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
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
                    console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Authentication failed')
                    done();
                });
        });
        // todo Seed a user we can test against, and test password valid/invalid
    });
});