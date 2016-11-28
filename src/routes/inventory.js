/***********************
* INVENTORY
***********************/
'use strict'

const Boom = require ('boom')
const Uuid = require ('node-uuid')
const Joi = require('joi')
const Mongojs = require('hapi-mongojs')
const ObjectId = require("mongojs").ObjectId;

exports.register = (server, options, next) => {


  /***********************
  *  ROUTES
  ***********************/
  server.route({
    method: 'GET',
    path: '/inventory',

    handler(request, reply) {
      // get db collection
      const inventoryCollection = Mongojs.db().collection('inventory');
      // execute a query
      inventoryCollection.find((err, data) => {
          if (err) {
              return reply(Boom.wrap(err, 'Internal MongoDB error'))
          }
          reply(data)
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/distInventory',

    handler(request, reply) {
      const dist = request.payload;
      // get db collection
      const inventoryCollection = Mongojs.db().collection('inventory');
      // execute a query
      inventoryCollection.find(dist, (err, data) => {
          if (err) {
              return reply(Boom.wrap(err, 'Internal MongoDB error'))
          }
          reply(data)
      })
    }
  })

  server.route({
    // save ONE beer
    method: 'POST',
    path: '/inventory',

    handler(request, reply) {
      const beer = request.payload;

      const inventoryCollection = Mongojs.db().collection('inventory');


      inventoryCollection.save(beer, (err, result) => {

        if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }

        reply().code(204);
      })

    },
    config: {
      validate: {
        payload: {

          beerType: Joi.string().min(1).max(50).required(),
          brewery: Joi.string().min(1).max(50).required(),
          description: Joi.string().min(1).max(50).required(),
          distributer: Joi.string().min(1).max(50).required(),
          name: Joi.string().min(1).max(50).required(),
          qtyCases: Joi.number(),
          qtyHalfBarrels: Joi.number(),
          qtySixtels: Joi.number(),
          unitPrice: Joi.number(),

        }
      }
    }
  })

   next()
}





/***********************
* this defines a new Hapi plugin called 'routes-inventory'
***********************/
exports.register.attributes = {
  name: 'routes-inventory'
}
