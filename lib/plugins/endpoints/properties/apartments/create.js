'use strict';

var Property = require('../../../../models/property');
var Joi = require('joi');


exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/properties/{propertyId}/apartments',
    config: {
      description: 'Create an apartment',
      validate: {
        params: {
          propertyId: Joi.string().length(24).required()
        },
        payload: {
          name: Joi.string().required(),
          rooms: Joi.number().min(1),
          sqft: Joi.number().required(),
          bathrooms: Joi.number().required(),
          rent: Joi.number().required()
        }
      },
      handler: function(request, reply){
        Property.findOne({_id: request.params.propertyId, managerId: request.auth.credentials._id}, function(err, property){
          if(err){return reply().code(418); }
          property.apartments.push(request.payload);
          property.save();
          return reply(property.apartments[0]);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'apartments.create'
};
