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
  server.route({
    // save ONE account
    method: 'POST',
    path: '/orders',

    handler(request, reply) {
      const order = request.payload

      const orderCollection = Mongojs.db().collection('orders');


      orderCollection.save(order, (err, result) => {

        if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }

        reply().code(204);
      })

    },
    // config: {
    //   validate: {
    //     payload: {
    //
    //       repId: Joi.string().required(),
    //       accountName: Joi.string().min(1).max(50).required(),
    //       contact: Joi.string().min(1).max(50).required(),
    //       email: Joi.string().email(),
    //       phone: Joi.string().min(1).max(20),
    //       address: Joi.string().min(1).max(50),
    //       lastOrderDate: Joi.date().format('YYYY/MM/DD'),
    //       avgOrderAmmount: Joi.number()
    //
    //     }
    //   }
    // }
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
