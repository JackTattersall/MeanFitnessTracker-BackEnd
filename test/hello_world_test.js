process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();

describe('Hello world', () => {
    it('Should be Hello World', () => {
        should.equal('Hello world', 'Hello world')
    })
});