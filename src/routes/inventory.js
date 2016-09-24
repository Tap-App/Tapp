/***********************
* INVENTORY
***********************/
'use strict'

const Boom = require ('boom')
const Uuid = require ('node-uuid')
const Joi = require('joi')

exports.register = (server, options, next) => {
  const db = server.app.db

  /***********************
  *  ROUTES
  ***********************/
  server.route({
    method: 'GET',
    path: '/inventory',

    handler(request, reply) {
      db.inventory.find((err, data) => {
          if (err) {
              return reply(Boom.wrap(err, 'Internal MongoDB error'))
          }
          reply(data)
      })
    }
  })


  return next()
}





/***********************
* this defines a new Hapi plugin called 'routes-inventory'
***********************/
exports.register.attributes = {
  name: 'routes-inventory'
}
