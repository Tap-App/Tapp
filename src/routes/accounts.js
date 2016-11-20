/***********************
* ACCOUNTS
*
***********************/
'use strict'

const Boom = require ('boom')
const Uuid = require ('node-uuid')
const Joi = require('joi')

// This exports.register will wrap all ACCOUNTS routes.
exports.register = (server, options, next) => {
  const db = server.app.db


  /***********************
  *  ROUTES
  ***********************/
  server.route({
    // find ALL accounts
    method: 'GET',
    path: '/accounts',

    handler(request, reply) {
      db.accounts.find((err, data) => {

          if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
          reply(data)
      })

    }
  })

  server.route({
    // find ONE account
    method: 'GET',
    path: '/accounts/{id}',

    handler(request, reply) {
      db.accounts.findOne(
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
    path: '/accounts',

    handler(request, reply) {
      const account = request.payload
      //create an id
      account._id = Uuid.v1()

      db.accounts.save(account, (err, result) => {

        if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }

        reply(account)
      })

    },
    config: {
      validate: {
        payload: {

          repID: Joi.number().required(),
          accountName: Joi.string().min(10).max(50).required(),
          contact: Joi.string().min(1).max(50).required(),
          email: Joi.string().email(),
          phone: Joi.string().min(1).max(20),
          address: Joi.string().min(1).max(50),
          lastOrderDate: Joi.date().format('YYYY/MM/DD'),
          avgOrderAmmount: Joi.number()

        }
      }
    }
  })

  server.route({
    // update ONE account
    method: 'PATCH',
    path: '/accounts/{id}',

    handler(request, reply) {

      db.accounts.update(
        {_id: request.params.id},
        {$set: request.payload},
        (err, result) => {

          if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
          if (result.n === 0) { return reply(Boom.notFound()) }

          reply().code(204);
      })

    },
    config: {
      validate: {
        payload: Joi.object({

          repID: Joi.number().required(),
          accountName: Joi.string().min(10).max(50).optional(),
          contact: Joi.string().min(1).max(50).optional(),
          email: Joi.string().email().optional(),
          phone: Joi.string().min(1).max(20).optional(),
          address: Joi.string().min(1).max(50).optional(),
          lastOrderDate: Joi.date().format('YYYY/MM/DD').optional(),
          avgOrderAmmount: Joi.number().optional()

        }).required().min(1)
      }
    }
  })

  server.route({
      // remove ONE account
      method: 'DELETE',
      path: '/accounts/{id}',
      handler(request, reply) {

          db.accounts.remove(
            {id: request.params.id},
            (err, result) => {

              if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
              if (result.n === 0) { return reply(Boom.notFound()) }

              reply().code(204);
          })
      }
  })


   next()
}




/***********************
* this defines a new Hapi plugin called 'routes-accounts'
***********************/
exports.register.attributes = {
  name: 'routes-accounts'
}
