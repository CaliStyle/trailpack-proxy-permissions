'use strict'

const Trailpack = require('trailpack')
const lib = require('./lib')

module.exports = class ProxyPermissionsTrailpack extends Trailpack {

  /**
   * Validate proxypermissions config
   */
  validate () {
    if (!this.app.config.proxypermissions) {
      return Promise.reject(
        new Error('config.proxypermissions is absent, check it\'s present and loaded under index.js'))
    }
    return lib.Validator.validateConfig(this.app.config.proxypermissions)
  }
  /**
   * Setup routes permissions and load fixtures if needed
   */
  initialize() {
    return lib.Utils.buildRoutesFixtures(this.app).then(fixtures => {
      this.routesFixtures = fixtures
      return lib.Utils.loadFixtures(this.app)
    })
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

