/* eslint no-console: [0] */
/* eslint no-underscore-dangle: [0]*/
'use strict'

const Policy = require('trails/policy')
const multer = require('multer')

/**
 * @module UserPolicy
 * @description User Policy
 */
module.exports = class UserPolicy extends Policy {
  csv(req, res, next) {
    const upload = multer({dest: 'test/uploads/'})
    upload.single('file')(req, res, err => {
      if (err) {
        this.log.info(err)
      }
      next()
    })
  }
}

