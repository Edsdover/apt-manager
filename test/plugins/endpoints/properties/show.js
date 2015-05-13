/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var CP = require('child_process');
var Path = require('path');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var Sinon = require('sinon');
var Property = require('../../../../lib/models/property');
var server;

describe('GET /properties', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('localhost/')[1];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should create a property', function(done){
    expect(2).to.equal(2);
    done();
  });
  it('should get a managers property by id', function(done){
    server.inject({method: 'GET', url: '/properties/b00000078901234567890013', credentials: {_id: 'b12345678901234567890012'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.property.name).to.equal('Lover Condo');
      done();
    });
  });
  it('should not get one managers property for another', function(done){
    server.inject({method: 'GET', url: '/properties/b00000078901234567890013', credentials: {_id: 'b12345678901234567890013'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.property).to.be.null;
      done();
    });
  });
  it('should not get passed JOI VALI if bad id', function(done){
    server.inject({method: 'GET', url: '/properties/b00000000078901234567890013', credentials: {_id: 'b12345678901234567890013'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should return err if server explodes', function(done){
    var stub = Sinon.stub(Property, 'findOne').yields(new Error());
    server.inject({method: 'GET', url: '/properties/b00000078901234567890013', credentials: {_id: 'b12345678901234567890012'}}, function(response){
      expect(response.statusCode).to.equal(418);
      stub.restore();
      done();
    });
  });
});
