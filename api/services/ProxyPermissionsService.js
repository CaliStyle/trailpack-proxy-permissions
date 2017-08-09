'use strict'

const Service = require('trails/service')

/**
 * @module ProxyPermissionsService
 * @description ProxyPermissionsService
 */
module.exports = class ProxyPermissionsService extends Service {
  /**
   *
   * @param req
   * @param options
   * @returns {*}
   */
  reqRoles(req, options) {
    options = options || {}
    if (req.user) {
      let resUser
      return this.app.orm['User'].resolve(req.user, {transaction: options.transaction || null})
        .then(user => {
          resUser = user
          return resUser.resolveRoles({transaction: options.transaction || null})
        })
        .then(() => {
          return resUser.roles.map(r => r.name)
        })
    }
    else {
      return Promise.resolve(['public'])
    }
  }

  /**
   *
   * @param req
   * @param result
   * @returns {*|Promise.<T>}
   */
  sanitizeResult(req, result) {
    return this.reqRoles(req)
      .then((roles) => {
        return result
      })
  }
}

