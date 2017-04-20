'use strict'
const joi = require('joi')

module.exports = [
  {
    method: ['GET'],
    path: '/user',
    handler: 'UserController.findAll',
    config: {
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.string(),
          where: joi.any()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUserRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/user',
    handler: 'UserController.update',
    config: {
      app: {
        proxyPermissions: {
          resource_name: 'apiPostUserRoute',
          roles: ['admin','registered']
        }
      }
    }
  },
  {
    method: ['GET'],
    path: '/user/:id',
    handler: 'UserController.findById',
    config: {
      validate: {
        params: {
          id: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUserIdRoute',
          roles: ['admin']
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
          resource_name: 'apiPostUserIdRoute',
          roles: ['admin','registered']
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/user/:id/addRole/:role',
    handler: 'UserController.addRole',
    config: {
      validate: {
        params: {
          id: joi.any().required(),
          role: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiPostUserIdAddRoleRoleRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['POST'],
    path: '/user/:id/removeRole/:role',
    handler: 'UserController.removeRole',
    config: {
      validate: {
        params: {
          id: joi.any().required(),
          role: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiPostUserIdRemoveRoleRoleRoute',
          roles: ['admin']
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
          resource_name: 'apiPostUserUploadCsvRoute',
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
          resource_name: 'apiPostUserProcessUploadRoute',
          roles: ['admin']
        }
      }
    }
  }
]
