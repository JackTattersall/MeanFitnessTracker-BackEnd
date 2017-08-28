//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose"),
    User = require('../api/models/users'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should();

chai.use(chaiHttp);

//Our parent block

describe('Books', () => {
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
});