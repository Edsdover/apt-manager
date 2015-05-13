'use strict';

var Property = require('../../../models/property');
var Joi = require('joi');


exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/properties/{propertyId}',
    config: {
      description: 'Get a single property',
      validate: {
        params: {
          propertyId: Joi.string().length(24).required()
        }
      },
      handler: function(request, reply){
        Property.findOne({_id: request.params.propertyId, managerId: request.auth.credentials._id}, function(err, property){
          if(err){return reply().code(418); }
          return reply({property: property});
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'properties.show'
};
