/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../../lib/server');
var Sinon = require('sinon');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var Property = require('../../../../../lib/models/property');
var server;

describe('POST /properties/{propertyId}/apartments', function(){
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
  it('should create an apartment', function(done){
    server.inject({method: 'POST', url: '/properties/b00000078901234567890011/apartments', credentials: {_id: 'b12345678901234567890011'}, payload: {name: 'A1', rooms: '3', sqft: '1000', bathrooms: '3', rent: '3000'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('A1');
      expect(response.result.rooms).to.equal(3);
      expect(response.result.sqft).to.equal(1000);
      expect(response.result.bathrooms).to.equal(3);
      expect(response.result.rent).to.equal(3000);
      expect(response.result.renters).to.have.length(0);
      expect(response.result.isAvailable).to.be.true;
      expect(response.result.createdAt).to.be.instanceOf(Date);
      done();
    });
  });
  it('should return 418 when server self destructs', function(done){
    var stub = Sinon.stub(Property, 'findOne').yields(new Error());
    server.inject({method: 'POST', url: '/properties/b00000078901234567890011/apartments', credentials: {_id: 'b12345678901234567890011'}, payload: {name: 'A1', rooms: '3', sqft: '1000', bathrooms: '3', rent: '3000'}}, function(response){
      expect(response.statusCode).to.equal(418);
      stub.restore();
      done();
    });
  });
});
