'use strict'

const joi = require('joi')
const lib = require('../')

module.exports = {
  validateConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, lib.Schemas.proxyPermissions, (err, value) => {
        if (err) {
          return reject(new TypeError('config.proxyPermissions: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
