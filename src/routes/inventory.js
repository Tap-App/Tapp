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
    path: '/distInventory/{dist}',

    handler(request, reply) {

      // get db collection
      const inventoryCollection = Mongojs.db().collection('inventory');
      // execute a query
      inventoryCollection.find({distributer : request.params.dist}, (err, data) => {
          if (err) {
              return reply(Boom.wrap(err, 'Internal MongoDB error'))
          }
          reply(data)
      })
    }
  })
  server.route({
    method: 'GET',
    path: '/oneBeer/{beerName}',

    handler(request, reply) {

      // get db collection
      const inventoryCollection = Mongojs.db().collection('inventory');
      // execute a query
      inventoryCollection.find({name : request.params.beerName}, (err, data) => {
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

  server.route({
    // update ONE beer
    method: 'PUT',
    path: '/inventory',

    handler(request, reply) {
      const beerAdd = request.payload;
      const setValue = beerAdd.qty;
      const setField = beerAdd.field;

      console.log(setField,setValue);
      const inventoryCollection = Mongojs.db().collection('inventory');

      inventoryCollection.update(
        {name:beerAdd.name},
        {$set: {[setField] : setValue}},
        (err, result) => {

          if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
          if (result.n === 0) { return reply(Boom.notFound()) }

          reply().code(204);
      })

    },
    // config: {
    //   validate: {
    //     payload: Joi.object({
    //
    //       repID: Joi.number().optional(),
    //       accountName: Joi.string().min(10).max(50).optional(),
    //       contact: Joi.string().min(1).max(50).optional(),
    //       email: Joi.string().email().optional(),
    //       phone: Joi.string().min(1).max(20).optional(),
    //       address: Joi.string().min(1).max(50).optional(),
    //       lastOrderDate: Joi.date().format('YYYY/MM/DD').optional(),
    //       avgOrderAmmount: Joi.number().optional()
    //
    //     }).required().min(1)
    //   }
    // }
  })


   next()
}





/***********************
* this defines a new Hapi plugin called 'routes-inventory'
***********************/
exports.register.attributes = {
  name: 'routes-inventory'
}
