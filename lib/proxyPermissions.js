/* eslint no-console: [0] */
'use strict'

const _ = require('lodash')
const routes = require('./routes')
const policies = require('./policies')

module.exports = {
  configure: (app) => {
    return Promise.resolve()
  },
  /**
   * init - Initialize
   * @param app
   */
  init: (app) => {
    return Promise.resolve()
  },

  /**
   * addRoutes - Add the Proxy Router controller routes
   * @param app
   */
  addRoutes: (app) => {
    const prefix = _.get(app.config, 'proxyPermissions.prefix') || _.get(app.config, 'footprints.prefix')
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
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app) => {
    app.config.proxyPermissionsDefaults = _.clone(app.config.proxyPermissions)
    return Promise.resolve({})
  },
  /**
   * add Cron Jobs to Proxy Engine
   * @param app
   * @returns {Promise.<{}>}
   */
  addCrons: (app) => {
    if (!app.api.crons) {
      app.api.crons  = {}
    }
    return Promise.resolve({})
  },
  /**
   * add Events to Proxy Engine
   * @param app
   * @returns {Promise.<{}>}
   */
  addEvents: (app) => {
    if (!app.api.events) {
      app.api.events  = {}
    }
    return Promise.resolve({})
  },
  /**
   * add Tasks to Proxy Engine
   * @param app
   * @returns {Promise.<{}>}
   */
  addTasks: (app) => {
    if (!app.api.tasks) {
      app.api.tasks  = {}
    }
    return Promise.resolve({})
  }
}
