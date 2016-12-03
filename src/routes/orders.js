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
    // find A Distributer's orders
    method: 'GET',
    path: '/ordersDist',

    handler(request, reply) {
      const dist = request.payload;
      // get db collection
      const ordersCollection = Mongojs.db().collection('orders');
      // execute a query
      ordersCollection.find(dist, (err, data) => {

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

  })
  server.route({
    // mark as delived: true
    method: 'PUT',
    path: '/orders/{id}',
    handler(request, reply) {
      const ordersCollection = Mongojs.db().collection('orders');
      var oid = ObjectId(request.params.id);

        ordersCollection.update(
          { _id: oid},
          {$set: {delivered: true}},
          (err, result) => {

            if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
            if (result.n === 0) { return reply(Boom.notFound()) }

            reply().code(204);
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
