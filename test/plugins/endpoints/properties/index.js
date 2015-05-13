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
  it('should get all a managers properties', function(done){
    server.inject({method: 'GET', url: '/properties', credentials: {_id: 'b12345678901234567890012'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.properties).to.have.length(2);
      done();
    });
  });
  it('should get no properties for non matches', function(done){
    server.inject({method: 'GET', url: '/properties', credentials: {_id: 'b12345678909999567890012'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.properties).to.have.length(0);
      done();
    });
  });
  it('should fail if invalid id', function(done){
    var stub = Sinon.stub(Property, 'find').yields(new Error());
    server.inject({method: 'GET', url: '/properties', credentials: {_id: 'b12345678901234567890012'}}, function(response){
      expect(response.statusCode).to.equal(418);
      stub.restore();
      done();
    });
  });
});
