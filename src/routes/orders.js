/***********************
* ORDERS
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
    // find ALL orders
    method: 'GET',
    path: '/orders',

    handler(request, reply) {
      // get db collection
      const ordersCollection = Mongojs.db().collection('orders');
      // execute a query
      ordersCollection.find((err, data) => {

          if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
          reply(data)
      })

    }
  })

  server.route({
    // find ONE one order
    method: 'GET',
    path: '/orders/{id}',

    handler(request, reply) {
      // get db collection
      const ordersCollection = Mongojs.db().collection('orders');
      // execute a query
      ordersCollection.findOne(
        {_id: request.params.id},
        (err, data) => {

        if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
        if (!data) { return reply(Boom.notFound()) }

        reply(data)
      })

    }
  })

  next()
// end of register wrapper
}

/***********************
* this defines a new Hapi plugin called 'routes-orders'
***********************/
exports.register.attributes = {
  name: 'routes-orders'
}
