/* eslint no-console: [0] */
'use strict'

const lib = require('./')
const _ = require('lodash')

module.exports = {
  /**
   *
   * @param app
   * @returns {Promise.<{resources: Array, permissions: Array}>}
   */
  buildRoutesFixtures: app => {
    const fixtures = {
      resources: [],
      permissions: []
    }
    app.config.routes.forEach(route => {
      const config = _.get(route.config, 'app.proxyPermissions')
      if (config && config.roles && config.resource_name) {
        if (_.isString(config.roles)) {
          config.roles = [config.roles]
        }
        fixtures.resources.push({
          type: 'route',
          name: config.resource_name,
          public_name: config.resource_name
        })
        config.roles.forEach(role => {
          fixtures.permissions.push({
            resource_name: config.resource_name,
            role_name: role,
            action: 'access'
          })
        })
      }
    })
    // console.log('utils.buildRoutesFixtures',fixtures)
    return Promise.resolve(fixtures)
  },

  loadFixtures: app => {
    return Promise.all([
      app.orm['Role'].find({limit: 1}).then(roles => {
        if (!roles || roles.length === 0) {
          app.log.debug('utils.loadFixtures: Roles empty, loadRoles...')
          return lib.Utils.loadRoles(app)
        }
      }),
      app.orm['Resource'].find({limit: 1}).then(resources => {
        if (!resources || resources.length === 0) {
          app.log.debug('utils.loadFixtures: Resources empty, loadResources...')
          return lib.Utils.loadResources(app)
        }
      })
    ]).then(results => {
      return app.orm['Permission'].find({limit: 1}).then(permissions => {
        if (!permissions || permissions.length === 0) {
          app.log.debug('utils.loadFixtures: Permissions empty, loadPermissions...')
          return lib.Utils.loadPermissions(app)
        }
      })
    })
  },

  /**
   *
   * @param app
   * @returns {*}
   */
  loadRoles: app => {
    const roles = app.config.proxyPermissions.fixtures.roles
    if (roles.length > 0) {
      return app.orm.Role.bulkCreate(roles)
    }
  },

  /**
   *
   * @param app
   * @returns {Promise.<T>}
   */
  loadResources: app => {
    let resources = app.config.proxyPermissions.fixtures.resources.concat(app.packs['proxy-permissions'].routesFixtures.resources)
    if (app.config.proxyPermissions.modelsAsResources) {
      const models = []
      Object.keys(app.orm).forEach(modelName => {
        models.push({
          type: 'model',
          name: modelName.toLowerCase(),
          public_name: modelName
        })
      })
      resources = resources.concat(models)
    }
    if (resources.length > 0) {
      app.log.debug('utils.loadResources bulkCreate()')
      return app.orm.Resource.bulkCreate(resources)
        .catch(err => {
          app.log.error(err)
        })
    }
  },

  /**
   *
   * @param app
   * @returns {*}
   */
  loadPermissions: app => {
    const permissions = app.config.proxyPermissions.fixtures.permissions.concat(app.packs['proxy-permissions'].routesFixtures.permissions)
    if (permissions.length > 0) {
      app.log.debug('utils.loadPermissions bulkCreate()')
      return app.orm.Permission.bulkCreate(permissions)
    }
  },

  buildAdminFixtures: app => {
    return app.orm['User'].find({limit: 1, attributes: ['id']}).then(users => {
      if (!users || users.length === 0) {
        app.log.debug('utils.loadFixtures: Users empty, loadAdmin...')
        return lib.Utils.loadAdmin(app)
      }
    })
  },
  loadAdmin: app => {
    return app.services.PassportService.register(null, {
      username: app.config.proxyPermissions.defaultAdminUsername,
      password: app.config.proxyPermissions.defaultAdminPassword
    })
      .then(admin => {
        return app.services.PermissionService.addRoleToUser(admin, 'admin')
      })
  }
}
