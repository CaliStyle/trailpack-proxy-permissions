'use strict'

const joi = require('joi')

const schemas = require('./schemas')

module.exports = {
  validateConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, schemas.proxyPermissions, (err, value) => {
        if (err) {
          return reject(new TypeError('config.proxyPermissions: ' + err))
        }
        return resolve(value)
      })
    })
  },
  validateMiddleware (middlewares) {
    return new Promise((resolve, reject) => {
      joi.validate(middlewares, schemas.proxyPermissionsMiddleware, (err, value) => {
        if (err) {
          return reject(new TypeError('config.web.middlewares: ' + err))
        }
        return resolve(value)
      })
    })
  },
}
