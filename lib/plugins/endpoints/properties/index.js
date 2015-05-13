'use strict';

var Property = require('../../../models/property');
// var Joi = require('joi');


exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/properties',
    config: {
      description: 'Create a property',
      handler: function(request, reply){
        Property.find({managerId: request.auth.credentials._id}, function(err, properties){
          if(err){return reply().code(418); }
          return reply({properties: properties});
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'properties.index'
};
