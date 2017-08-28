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