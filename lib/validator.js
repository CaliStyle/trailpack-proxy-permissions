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
  }
}
