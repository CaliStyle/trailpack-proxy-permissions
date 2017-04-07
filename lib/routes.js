'use strict'
const joi = require('joi')

module.exports = [
  {
    method: ['POST'],
    path: '/user',
    handler: 'UserController.update',
    config: {
      app: {
        proxyPermissions: {
          resource: 'route',
          roles: ['admin','registered']
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/user/:id',
    handler: 'UserController.update',
    config: {
      validate: {
        params: {
          id: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource: 'route',
          roles: ['admin','registered']
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/user/uploadCSV',
    handler: 'UserController.uploadCSV',
    config: {
      app: {
        proxyPermissions: {
          resource: 'route',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/user/processUpload/:id',
    handler: 'UserController.processUpload',
    config: {
      validate: {
        params: {
          id: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource: 'route',
          roles: ['admin']
        }
      }
    }
  }
]
