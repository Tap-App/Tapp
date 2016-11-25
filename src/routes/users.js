/***********************
* USERS
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
    path: '/users',

    handler(request, reply) {
      // get db collection
      const userCollection = Mongojs.db().collection('users');
      // execute a query
      userCollection.find((err, data) => {
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
* this defines a new Hapi plugin called 'routes-users'
***********************/
exports.register.attributes = {
  name: 'routes-users'
}
