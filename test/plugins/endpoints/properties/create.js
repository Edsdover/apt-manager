/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /properties', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should create a property', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a123456789qwertyuiopzxc1'}, payload: {name: 'Lover Mansion', address: '420 Stoner Ave'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Lover Mansion');
      expect(response.result.address).to.equal('420 Stoner Ave');
      expect(response.result.createdAt).to.be.instanceof(Date);
      expect(response.result.__v).to.be.a('number');
      expect(response.result.managerId.toString()).to.have.length(24);
      expect(response.result.managerId.toString()).to.equal('a123456789000e00000000c1');
      done();
    });
  });
  it('should fail if name is too short', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a123456789qwertyuiopzxc1'}, payload: {name: 'pi', address: '420 Stoner Ave'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should fail if address is too short', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a123456789qwertyuiopzxc1'}, payload: {name: 'chicken', address: 'ST'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should fail if no address in payload', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a123456789qwertyuiopzxc1'}, payload: {name: 'chicken'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
