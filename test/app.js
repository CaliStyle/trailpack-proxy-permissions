'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const ModelPassport = require('trailpack-proxy-passport/api/models/User')
const ModelPermissions = require('../api/models/User')
const Model = require('trails/model')
const Controller = require('trails/controller')

const DIALECT = process.env.DIALECT || 'sqlite'

const stores = {
  sqlitedev: {
    database: 'ProxyPermissions',
    storage: './test/test.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  },
  uploads: {
    database: 'ProxyPermissions',
    storage: './test/test.uploads.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}

if (DIALECT == 'postgres') {
  stores.sqlitedev = {
    database: 'ProxyPermissions',
    host: '127.0.0.1',
    dialect: 'postgres'
  }
}
else {
  stores.sqlitedev = {
    database: 'ProxyPermissions',
    storage: './test/test.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}

const App = {
  pkg: {
    name: 'trailpack-proxy-permissions-test',
    version: '1.0.0'
  },
  api: {
    controllers: {
      TestController: class TestController extends Controller {
        success(req, res){
          res.status(200).end()
        }
        failure(req, res){
          res.status(400).end()
        }
      }
    },
    models: {
      User: class User extends ModelPassport {
        static config(app, Sequelize) {
          return {
            options: {
              underscored: true,
              classMethods: {
                associate: (models) => {
                  ModelPassport.config(app, Sequelize).options.classMethods.associate(models)
                  ModelPermissions.config(app, Sequelize).options.classMethods.associate(models)
                  models.User.belongsToMany(models.Item, {
                    as: 'items',
                    through: {
                      model: models.UserItem,
                      foreignKey: 'user_id'
                    },
                    constraints: false
                  })
                },
                findByIdDefault: ModelPermissions.config(app, Sequelize).options.classMethods.findByIdDefault,
                findOneDefault: ModelPermissions.config(app, Sequelize).options.classMethods.findOneDefault,
                resolve: ModelPassport.config(app, Sequelize).options.classMethods.resolve,
              },
              instanceMethods: {
                getSalutation: ModelPassport.config(app, Sequelize).options.instanceMethods.getSalutation,
                resolvePassports: ModelPassport.config(app, Sequelize).options.instanceMethods.resolvePassports,
                resolveRoles: function(options) {
                  options = options || {}
                  if (
                    this.roles
                    && this.roles.every(t => t instanceof app.orm['Role'])
                    && options.reload !== true
                  ) {
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
        }
      },
      Item: class Item extends Model {
        static config(app, Sequelize) {
          return {
            options: {
              underscored: true,
              classMethods: {
                associate: (models) => {
                  models.Item.belongsToMany(models.User, {
                    as: 'owners',
                    through: {
                      model: models.UserItem,
                      foreignKey: 'item_id',
                      scope: {
                        item: 'item'
                      }
                    },
                    constraints: false
                  })
                }
              }
            }
          }
        }
        static schema(app, Sequelize) {
          return {
            name: {
              type: Sequelize.STRING,
              allowNull: false
            }
          }
        }
      }
    }
  },
  config: {
    database: {
      stores: stores,
      models: {
        defaultStore: 'sqlitedev',
        migrate: 'drop'
      }
    },
    proxyPassport: {
      strategies: {
        //Enable local strategy
        local: {
          strategy: require('passport-local').Strategy,
          options: {
            usernameField: 'username'// If you want to enable both username and email just remove this field
          }
        }
      },
      onUserLogin: {
        user: (req, app, user) => {
          return Promise.resolve(user)
        }
      }
    },
    routes: [
      {
        method: 'GET',
        path: '/success/public/permissions',
        handler: 'TestController.success',
        config: {
          app: {
            proxyPermissions: {
              resource_name: 'successRoute',
              roles: ['public']
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/failure/public/permissions',
        handler: 'TestController.failure',
        config: {
          app: {
            proxyPermissions: {
              resource_name: 'failureRoute',
              roles: ['test']
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/success/logged/permissions',
        handler: 'TestController.success',
        config: {
          app: {
            proxyPermissions: {
              resource_name: 'successLoggedRoute',
              roles: ['test']
            }
          }
        }
      },
      {
        method: 'GET',
        path: '/failure/logged/permissions',
        handler: 'TestController.failure',
        config: {
          app: {
            proxyPermissions: {
              resource_name: 'failureLoggedRoute',
              roles: ['admin']
            }
          }
        }
      }
    ],
    proxyPermissions: {
      prefix: '/api',
      defaultRole: 'public',
      defaultRegisteredRole: 'registered',
      modelsAsResources: true,
      fixtures: {
        roles: [{
          name: 'test',
          public_name: 'test'
        }, {
          name: 'admin',
          public_name: 'Admin'
        }, {
          name: 'registered',
          public_name: 'Registered'
        },{
          name: 'public' ,
          public_name: 'Public'
        }],
        resources: [{
          type: 'route',
          name: 'fixture',
          public_name: 'fixture'
        }],
        permissions: [{
          role_name: 'test',
          resource_name: 'fixture',
          action: 'action'
        }, {
          role_name: 'test',
          relation: 'owner',
          resource_name: 'item',
          action: 'access'
        }, {
          role_name: 'test',
          relation: 'owner',
          resource_name: 'item',
          action: 'create'
        }, {
          role_name: 'test',
          relation: 'owner',
          resource_name: 'item',
          action: 'update'
        }, {
          role_name: 'test',
          relation: 'owner',
          resource_name: 'item',
          action: 'destroy'
        }, {
          role_name: 'admin',
          resource_name: 'item',
          action: 'access'
        }, {
          role_name: 'admin',
          relation: 'owner',
          resource_name: 'item',
          action: 'create'
        }, {
          role_name: 'admin',
          relation: 'owner',
          resource_name: 'item',
          action: 'update'
        }, {
          role_name: 'admin',
          relation: 'owner',
          resource_name: 'item',
          action: 'destroy'
        }, {
          role_name: 'admin',
          resource_name: 'user',
          action: 'create'
        }, {
          role_name: 'admin',
          resource_name: 'user',
          action: 'update'
        }, {
          role_name: 'admin',
          resource_name: 'user',
          action: 'destroy'
        }]
      }
    },
    footprints: {
      controllers: {
        ignore: ['UserController','RoleController','AuthController','EventController']
      },
      prefix: '/api'
    },
    policies: {
      '*': ['CheckPermissions.checkRoute'],
      // 'UserController': ['CheckPermissions.checkRoute'],
      'FootprintController': ['CheckPermissions.checkModel']
    },
    main: {
      packs: [
        require('trailpack-router'),
        require('trailpack-express'),
        require('trailpack-proxy-sequelize'),
        require('trailpack-proxy-passport'),
        require('trailpack-footprints'),
        require('trailpack-proxy-engine'),
        require('../') // trailpack
      ]
    },
    session: {
      secret: 'ok'
    },
    proxyEngine: {
      live_mode: false,
      profile: 'test'
    },
    web: {
      express: require('express'),
      middlewares: {
        order: [
          'addMethods',
          'cookieParser',
          'session',
          'passportInit',
          'passportSession',
          'bodyParser',
          'compression',
          'methodOverride',
          'www',
          'router'
        ]
      }
    }
  }
}

const dbPath = __dirname + './test.sqlite'
const dbUploadPath = __dirname + './test.uploads.sqlite'
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

if (fs.existsSync(dbUploadPath)) {
  fs.unlinkSync(dbUploadPath)
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
