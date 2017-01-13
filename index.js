'use strict'

const Trailpack = require('trailpack')
const lib = require('./lib')

module.exports = class ProxyPermissionsTrailpack extends Trailpack {

  /**
   * Validate proxyPermissions config
   */
  validate () {
    if (!this.app.config.proxyPermissions) {
      return Promise.reject(
        new Error('config.proxyPermissions is absent, check it\'s present and loaded under index.js'))
    }
    return lib.Validator.validateConfig(this.app.config.proxyPermissions)
  }

  /**
   * Adds Routes, Policies, and Agenda
   */
  configure () {
    return Promise.all([
      lib.ProxyPermissions.addPolicies(this.app),
      lib.ProxyPermissions.addRoutes(this.app),
      lib.ProxyPermissions.addAgenda(this.app),
      lib.ProxyPermissions.copyDefaults(this.app)
    ])
  }

  /**
   * Setup routes permissions and load fixtures if needed
   */
  initialize() {
    return Promise.all([
      lib.ProxyPermissions.init(this.app),
      lib.Utils.buildRoutesFixtures(this.app).then(fixtures => {
        this.routesFixtures = fixtures
        return lib.Utils.loadFixtures(this.app)
      })
    ])
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

