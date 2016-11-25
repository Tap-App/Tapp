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


   next()
}





/***********************
* this defines a new Hapi plugin called 'routes-inventory'
***********************/
exports.register.attributes = {
  name: 'routes-inventory'
}
