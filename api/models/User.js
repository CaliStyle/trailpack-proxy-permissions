'use strict'

const Model = require('trails/model')
const _ = require('lodash')
const queryDefaults = require('../utils/queryDefaults')

module.exports = class User extends Model {
  static config(app, Sequelize) {
    const config = {
      options: {
        underscored: true,
        hooks: {
          afterCreate: [
            (values, options, fn) => {
              app.services.PermissionService.addRoleToUser(values, app.config.proxyPermissions.defaultRegisteredRole, options)
                .then(values => {
                  fn(null, values)
                })
                .catch(err => {
                  fn(err)
                })
            }
          ]
        },
        classMethods: {
          associate: (models) => {
            models.User.belongsToMany(models.Role, {
              as: 'roles',
              through: {
                model: models.UserRole,
              },
              foreignKey: 'user_id'
              // constraints: false
            })
            models.User.hasMany(models.Event, {
              as: 'events',
              foreignKey: 'object_id',
              scope: {
                object: 'user'
              },
              constraints: false
            })
          },
          findByIdDefault: function(criteria, options) {
            if (!options) {
              options = {}
            }
            options = _.merge(options, queryDefaults.User.default(app))
            return this.findById(criteria, options)
          },
          findOneDefault: function(options) {
            if (!options) {
              options = {}
            }
            options = _.merge(options, queryDefaults.User.default(app))
            return this.findOne(options)
          }
        },
        instanceMethods: {
          resolveRoles: function(options) {
            options = options || {}
            if (this.roles) {
              return Promise.resolve(this)
            }
            else {
              return this.getRoles({transaction: options.transaction || null})
                .then(roles => {
                  roles = roles || []
                  this.roles = roles
                  this.setDataValue('roles', roles)
                  this.set('roles', roles)
                  return this
                })
            }
          }
        }
      }
    }
    return config
  }

  static schema(app, Sequelize) {

  }
}
