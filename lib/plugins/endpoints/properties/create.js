'use strict';

var Property = require('../../../models/property');
var Joi = require('joi');


exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/properties',
    config: {
      description: 'Create a property',
      validate: {
        payload: {
          name: Joi.string().min(3).required(),
          address: Joi.string().min(3).required()
        }
      },
      handler: function(request, reply){
        var property = new Property(request.payload);
        property.managerId = request.auth.credentials._id;
        property.save(function(){
          return reply(property);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'properties.create'
};
