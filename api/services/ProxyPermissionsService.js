'use strict'

const Service = require('trails/service')
const _ = require('lodash')
const Errors = require('proxy-engine-errors')

/**
 * @module ProxyPermissionsService
 * @description ProxyPermissionsService
 */
module.exports = class ProxyPermissionsService extends Service {
  resolveUser(user, options){
    const User =  this.app.orm.User
    if (user instanceof User.Instance){
      return Promise.resolve(user)
    }
    else if (user && _.isObject(user) && user.id) {
      return User.findByIdDefault(user.id, options)
        .then(resUser => {
          if (!resUser) {
            throw new Errors.FoundError(Error(`User ${user.id} not found`))
          }
          return resUser
        })
    }
    else if (user && (_.isString(user) || _.isNumber(user))) {
      return User.findByIdDefault(user, options)
        .then(resUser => {
          if (!resUser) {
            throw new Errors.FoundError(Error(`User ${user} not found`))
          }
          return resUser
        })
    }
    else {
      // TODO create proper error
      const err = new Error(`Unable to resolve User ${user}`)
      return Promise.reject(err)
    }
  }
  jsonCritera(str) {
    if (!str) {
      return {}
    }
    if (str instanceof Object) {
      return str
    }
    try {
      str = JSON.parse(str)
    }
    catch (err) {
      str = {}
    }
    return str
  }
}

