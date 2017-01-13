/* eslint no-console: [0] */
'use strict'

const _ = require('lodash')
const routes = require('./routes')
const policies = require('./policies')
const agenda = require('./agenda')

module.exports = {

  /**
   * init - Initialize
   * @param app
   */
  init: (app) => {
    _.each(app.config.proxyPermissions.subcribers, subscriber => {
      if (subscriber.name && subscriber.type && subscriber.fn) {
        app.services.ProxyEngineService.subscribe(`proxyPermissions.subscribers.${subscriber.name}`, subscriber.type, subscriber.fn)
      }
    })
    return Promise.resolve()
  },

  /**
   * addRoutes - Add the Proxy Router controller routes
   * @param app
   */
  addRoutes: (app) => {
    const prefix = _.get(app.config, 'proxypermissions.prefix') || _.get(app.config, 'footprints.prefix')
    const routerUtil = app.packs.router.util
    if (prefix){
      routes.forEach(route => {
        route.path = prefix + route.path
      })
    }
    app.config.routes = routerUtil.mergeRoutes(routes, app.config.routes)
    return Promise.resolve({})
  },
  /**
   *
   * @param app
   * @returns {Promise.<{}>}
   */
  addPolicies: (app) => {
    app.config.policies = _.merge(policies, app.config.policies)
    return Promise.resolve({})
  },
  /**
   *
   * @param app
   * @returns {Promise.<{}>}
   */
  addAgenda: (app) => {
    if (!app.config.proxyAgenda) {
      app.config.proxyAgenda = []
    }
    app.config.proxyAgenda = _.union(agenda, app.config.proxyAgenda)
    return Promise.resolve({})
  },
  /**
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app) => {
    app.config.proxyPermissionsDefaults = _.clone(app.config.proxyPermissions)
    return Promise.resolve({})
  }
}
