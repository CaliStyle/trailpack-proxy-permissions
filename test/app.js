'use strict'
const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const ModelPassport = require('trailpack-proxy-passport/api/models/User')
const ModelPermissions = require('../api/models/User')
const Model = require('trails/model')
const Controller = require('trails/controller')

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
              classMethods: {
                associate: (models) => {
                  ModelPassport.config(app, Sequelize).options.classMethods.associate(models)
                  ModelPermissions.config(app, Sequelize).options.classMethods.associate(models)
                  models.User.belongsToMany(models.Item, {
                    as: 'items',
                    through: 'UserItem'
                  })
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
              classMethods: {
                associate: (models) => {
                  models.Item.belongsToMany(models.User, {
                    as: 'owners',
                    through: 'UserItem'
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
      stores: {
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
      },

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
              resourceName: 'successRoute',
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
              resourceName: 'failureRoute',
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
              resourceName: 'successLoggedRoute',
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
              resourceName: 'failureLoggedRoute',
              roles: ['admin']
            }
          }
        }
      }
    ],
    proxyPermissions: {
      defaultRole: 'public',
      modelsAsResources: true,
      fixtures: {
        roles: [{
          name: 'test',
          publicName: 'test'
        }, {
          name: 'admin',
          publicName: 'Admin'
        },{
          name: 'public' ,
          publicName: 'Public'
        }],
        resources: [{
          type: 'route',
          name: 'fixture',
          publicName: 'fixture'
        }],
        permissions: [{
          roleName: 'test',
          resourceName: 'fixture',
          action: 'action'
        }, {
          roleName: 'test',
          relation: 'owner',
          resourceName: 'item',
          action: 'access'
        }, {
          roleName: 'test',
          relation: 'owner',
          resourceName: 'item',
          action: 'create'
        }, {
          roleName: 'test',
          relation: 'owner',
          resourceName: 'item',
          action: 'update'
        }, {
          roleName: 'test',
          relation: 'owner',
          resourceName: 'item',
          action: 'destroy'
        }, {
          roleName: 'admin',
          resourceName: 'item',
          action: 'access'
        }, {
          roleName: 'admin',
          relation: 'owner',
          resourceName: 'item',
          action: 'create'
        }, {
          roleName: 'admin',
          relation: 'owner',
          resourceName: 'item',
          action: 'update'
        }, {
          roleName: 'admin',
          relation: 'owner',
          resourceName: 'item',
          action: 'destroy'
        }]
      }
    },
    footprints: {
      controllers: false,
      prefix: '/api'
    },
    policies: {
      '*': ['CheckPermissions.checkRoute'],
      'FootprintController': ['CheckPermissions.checkModel']
    },
    main: {
      packs: [
        require('trailpack-router'),
        require('trailpack-express'),
        require('trailpack-sequelize'),
        require('trailpack-proxy-passport'),
        require('trailpack-footprints'),
        require('trailpack-proxy-engine'),
        require('../') // trailpack
      ]
    },
    session: {
      secret: 'ok'
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
