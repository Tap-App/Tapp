/***********************
* USERS
***********************/
'use strict'

const Boom = require ('boom')
const Uuid = require ('node-uuid')
const Joi = require('joi')

exports.register = (server, options, next) => {
  const db = server.app.db

  return next()
}


/***********************
*  ROUTES
***********************/
server.route({
  method: 'GET',
  path: '/users',

  handler(request, reply) {
    db.users.find((err, data) => {
        if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'))
        }
        reply(data)
    })
  }
})


/***********************
* this defines a new Hapi plugin called 'routes-users'
***********************/
exports.register.attributes = {
  name: 'routes-users'
}
