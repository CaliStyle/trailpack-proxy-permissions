'use strict'

const Trailpack = require('trailpack')
const _ = require('lodash')
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
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      return Promise.reject(new Error('This Trailpack only works for express!'))
    }
    if (!_.includes(_.keys(this.app.packs), 'sequelize')) {
      return Promise.reject(new Error('This Trailpack only works for Sequelize!'))
    }
    if (!_.includes(_.keys(this.app.packs), 'passport')) {
      return Promise.reject(new Error('This Trailpack requires passport!'))
    }
    if (!this.app.config.passport) {
      return Promise.reject(new Error('No configuration found at config.passport!'))
    }
    if (
      this.app.config.policies
      && this.app.config.policies['*']
      && this.app.config.policies['*'].indexOf('CheckPermissions.checkRoute') === -1
    ) {
      this.app.log.warn('ProxyPermissions Routes are unlocked! add \'*\' : [\'CheckPermissions.checkRoute\'] to config/policies.js')
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
      lib.ProxyPermissions.copyDefaults(this.app),
      lib.ProxyPermissions.addCrons(this.app),
      lib.ProxyPermissions.addEvents(this.app),
      lib.ProxyPermissions.addTasks(this.app)
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

