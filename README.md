# trailpack-proxy-permissions

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

## Permissions built for speed, security, scalability, and love from [Cali Style Technologies](https://cali-style.com)

The Proxy Permissions is built to be used on Trailsjs with Proxy Engine.
It's purpose is to allow for complex ERP style permissions down to the model level as well as restrict routes based on permissions.

## Dependencies
### Supported ORMs
| Repo          |  Build Status (edge)                  |
|---------------|---------------------------------------|
| [trailpack-sequelize](https://github.com/trailsjs/trailpack-sequelize) | [![Build status][ci-sequelize-image]][ci-sequelize-url] |

### Supported Webserver
| Repo          |  Build Status (edge)                  |
|---------------|---------------------------------------|
| [trailpack-express](https://github.com/trailsjs/trailpack-express) | [![Build status][ci-express-image]][ci-express-url] |

## Install

```sh
$ npm install --save trailpack-proxy-permissions
```

## Configuration

First you need to add this trailpack to your __main__ configuration : 
```js
// config/main.js

module.exports = {
   ...

   packs: [
      ...
      require('trailpack-proxy-permissions'),
      ...
   ]
   ...
}
```

Then permissions config:  
```js
// config/proxyPermissions.js
  defaultRole: null, //Role name to use for anonymous users
  userRoleFieldName: 'roles', // Name of the association field for Role under User model
  modelsAsResources: true, // Set all your models as resources automatically when initialize the database
  //Initial data added when DB is empty
  fixtures: {
    roles: [],
    resources: [],
    permissions: []
  }
```

You also need to have a User model like: 

```js
const Model = require('trails-model')
const ModelPassport = require('trailpack-passport/api/models/User') // If you use trailpack-pasport
const ModelPermissions = require('trailpack-proxy-permissions/api/models/User')
class User extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: (models) => {
            // Apply passport specific stuff
            ModelPassport.config(app, Sequelize).options.classMethods.associate(models) 
            // Apply permission specific stuff
            ModelPermissions.config(app, Sequelize).options.classMethods.associate(models)
            // Apply your specific stuff
          }
        }
      }
    }
  }
  static schema(app, Sequelize) {
    return {
     // your stuff
    }
  }
}
```

## Usage

### Manage roles
Use the native sequelize model under `this.app.orm.Roles`, if you need initial roles just add them on proxyPermissions config file under `fixtures.roles`.

### Manage resources
Use the native sequelize model under `this.app.orm.Resources`, if you need initial resources just add them on proxyPermissions config file under `fixtures.resources`.

### Manage model permissions
#### Static declaration under config
```js
//config/proxypermissions.js
fixtures: {
    roles: [{
      name: 'roleName',
      publicName: 'Role name'
    }],
    resources: [{
      type: 'model',
      name: 'modelName',
      publicName: 'Model name'
    }],
    permissions: [{
       roleName: 'roleName',
       resourceName: 'modelName',
       action: 'create'
     }, {
       roleName: 'roleName',
       resourceName: 'modelName',
       action: 'update'
     }, {
       roleName: 'roleName',
       resourceName: 'modelName',
       action: 'destroy'
     }, {
       roleName: 'roleName',
       resourceName: 'modelName',
       action: 'access'
     }]
  }
```

#### Owner permissions
This trailpack can manage owner permissions on model instance, to do this you need to declare your permissions like this : 
```
{
  roleName: 'roleName',
  relation: 'owner',
  resourceName: 'modelName',
  action: 'create'
}
```
You can create this permissions with sequelize model, with fixtures options or with PermissionService like this:
 
```js
this.app.services.PermissionService.grant('roleName', 'modelName', 'create', 'owner').then(perm => () => {})
.catch(err => this.app.log.error(err))
```

Then you need to declare an `owners` attributes on your models like this : 
```js
module.exports = class Item extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: (models) => {
            models.Item.belongsToMany(models.User, {
              as: 'owners',
              through: 'UserItem'//If many to many is needed
            })
          }
        }
      }
    }
  }
}
```
If the model is under a trailpack and you don't have access to it you can add a model with same name on your project, 
let's do this for the model User witch is already in trailpack-proxy-permissions and trailpack-passport:
 
```js
const ModelPassport = require('trailpack-passport/api/models/User')
const ModelPermissions = require('../api/models/User')
const Model = require('trails-model')
module.exports = class User extends Model {
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
  static schema(app, Sequelize) {
      const UserTrailpackSchema = ModelPassport.schema(app, Sequelize)
      let schema = {
        //All your attributes here
      }
      return _.defaults(UserTrailpackSchema, schema)//merge passport attributs with your
    }
}
```
Like this you can add `owners` permissions on all preferred models.

WARNING! Currently `owner` permissions are not supported for `update` `destroy` actions on multiple items (with no ID) 

#### Dynamically with PermissionService
```js
// Grant a permission to create 'modelName' to 'roleName'
this.app.services.PermissionService.grant('roleName', 'modelName', 'create').then(perm => () => {})
.catch(err => this.app.log.error(err))

// Revoke a permission to create 'modelName' to 'roleName'
this.app.services.PermissionService.revoke('roleName', 'modelName', 'create').then(perm => () => {})
.catch(err => this.app.log.error(err))
```

### Manage route permissions
Route permissions can be added directly under route definition: 
```js
{
  method: 'GET',
  path: '/api/myroute',
  handler: 'DefaultController.myroute',
  config: {
    app: {
      proxyPermissions: {
        resourceName: 'myrouteId',
        roles: ['roleName']
      }
    }
  }
}
```
When the DB is empty all routes permissions will be created, if you make any change after this you'll have to update permissions yourself.

You can use PermissionService anytime you want to grant or revoke routes permissions.

### Policies 
You have 2 policies to manage permissions, they return a 403 when user is not allowed : 

#### CheckPermissions.checkRoute
This one will check your route permissions, if they are no explicit permissions then the route _is_ accessible. 
The easy way to setup is : 

```js
//config/policies.js
'*': [ 'CheckPermissions.checkRoute' ]
//or
ViewController: [ 'CheckPermissions.checkRoute' ] 

```

#### CheckPermissions.checkModel
This one will check your model permissions, if there are no explicit permissions models _are not_ accessible
```js
//config/policies.js
FootprintController: [ 'CheckPermissions.checkModel' ] // To check permissions on models
```

[npm-image]: https://img.shields.io/npm/v/trailpack-proxy-permissions.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-proxy-permissions
[ci-image]: https://img.shields.io/circleci/project/github/CaliStyle/trailpack-proxy-permissions/master.svg
[ci-url]: https://circleci.com/gh/CaliStyle/trailpack-proxy-permissions/tree/master
[daviddm-image]: http://img.shields.io/david/calistyle/trailpack-proxy-permissions.svg?style=flat-square
[daviddm-url]: https://david-dm.org/calistyle/trailpack-proxy-permissions
[codeclimate-image]: https://img.shields.io/codeclimate/github/calistyle/trailpack-proxy-permissions.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/calistyle/trailpack-proxy-permissions

[ci-sequelize-image]: https://img.shields.io/travis/trailsjs/trailpack-sequelize/master.svg?style=flat-square
[ci-sequelize-url]: https://travis-ci.org/trailsjs/trailpack-sequelize

[ci-express-image]: https://img.shields.io/travis/trailsjs/trailpack-express/master.svg?style=flat-square
[ci-express-url]: https://travis-ci.org/trailsjs/trailpack-express
