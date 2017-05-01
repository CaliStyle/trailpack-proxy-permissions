'use strict'
const joi = require('joi')

module.exports = [
  {
    method: ['GET'],
    path: '/role',
    handler: 'RoleController.findAll',
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
          resource_name: 'apiGetRoleRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['GET'],
    path: '/role/count',
    handler: 'RoleController.count',
    config: {
      app: {
        proxyPermissions: {
          resource_name: 'apiGetRoleCountRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['GET'],
    path: '/role/generalStats',
    handler: 'RoleController.generalStats',
    config: {
      app: {
        proxyPermissions: {
          resource_name: 'apiGetRoleGeneralStatsRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['GET'],
    path: '/role/name/:role',
    handler: 'RoleController.findOne',
    config: {
      validate: {
        params: {
          id: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiGetRoleNameRoleRoute',
          roles: ['admin']
        }
      }
    }
  },
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
    path: '/user/count',
    handler: 'UserController.count',
    config: {
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUserCountRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['GET'],
    path: '/user/generalStats',
    handler: 'UserController.generalStats',
    config: {
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUserGeneralStatsRoute',
          roles: ['admin']
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
    method: ['GET'],
    path: '/user/:id/roles',
    handler: 'UserController.roles',
    config: {
      validate: {
        params: {
          id: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUserIdRolesRoute',
          roles: ['admin']
        }
      }
    }
  },
  {
    method: ['GET'],
    path: '/user/:id/events',
    handler: 'UserController.events',
    config: {
      validate: {
        params: {
          id: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUserIdEventsRoute',
          roles: ['admin']
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
    method: ['GET'],
    path: '/user/:id/events/:event',
    handler: 'UserController.event',
    config: {
      validate: {
        params: {
          id: joi.any().required(),
          event: joi.any().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUserIdEventsEventRoute',
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
