/***********************
* ACCOUNTS
*
***********************/
'use strict'

const Boom = require ('boom')
const Uuid = require ('node-uuid')
const Joi = require('joi')
const Mongojs = require('hapi-mongojs')
const ObjectId = require("mongojs").ObjectId;
// This exports.register will wrap all ACCOUNTS routes.
exports.register = (server, options, next) => {


  /***********************
  *  ROUTES
  ***********************/
  server.route({
    // find ALL accounts
    method: 'GET',
    path: '/accounts',

    handler(request, reply) {
      // get db collection
      const accountCollection = Mongojs.db().collection('accounts');
      // execute a query
      accountCollection.find((err, data) => {

          if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
          reply(data)
      })

    }
  })

  server.route({
    // find a rep's accounts
    method: 'GET',
    path: '/repAccounts/{repId}',

    handler(request, reply) {
      // get db collection
      const accountCollection = Mongojs.db().collection('accounts');
      // execute a query
      accountCollection.find({repId : request.params.repId}, (err, data) => {

          if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }
          reply(data)
      })

    }
  })

  server.route({
    // find ONE account
    method: 'GET',
    path: '/oneAccount/{id}',

    handler(request, reply) {

      accountCollection.findOne(
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

      const accountCollection = Mongojs.db().collection('accounts');


      accountCollection.save(account, (err, result) => {

        if (err) { return reply(Boom.wrap(err, 'Internal MongoDB error')) }

        reply().code(204);
      })

    },
    config: {
      validate: {
        payload: {

          repId: Joi.string().required(),
          accountName: Joi.string().min(1).max(50).required(),
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
    method: 'PUT',
    path: '/accounts/{id}',

    handler(request, reply) {
      var oid = ObjectId(request.params.id);
      var acctUpdate = request.payload;

      //  samplePayload = {
      //   lastOrderDate: today,
      //   avgOrderAmmnt: averageOrder
      // };

      const accountCollection = Mongojs.db().collection('accounts');

      accountCollection.update(
        {_id: oid},
        {$set: {lastOrderDate : acctUpdate.lastOrderDate, avgOrderAmmnt: acctUpdate.avgOrderAmmnt}},
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

  server.route({
      // remove ONE account
      method: 'DELETE',
      path: '/accounts/{id}',
      handler(request, reply) {
        const accountCollection = Mongojs.db().collection('accounts');
        var oid = ObjectId(request.params.id);

          accountCollection.remove(
            { _id: oid},
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
