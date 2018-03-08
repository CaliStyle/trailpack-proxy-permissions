'use strict'

const joi = require('joi')
const lib = require('../')

module.exports = {
  validateMiddleware (middlewares) {
    return new Promise((resolve, reject) => {
      joi.validate(middlewares, lib.Schemas.proxyPermissionsMiddleware, (err, value) => {
        if (err) {
          return reject(new TypeError('config.web.middlewares: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
