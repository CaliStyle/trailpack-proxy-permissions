'use strict'

const joi = require('joi')

const schemas = require('./schemas')

module.exports = {
  validateConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, schemas.proxypermissions, (err, value) => {
        if (err) return reject(new TypeError('config.proxypermissions: ' + err))

        return resolve(value)
      })
    })
  }
}
