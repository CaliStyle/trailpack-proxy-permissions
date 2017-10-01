'use strict'
const joi = require('joi')

module.exports = [
  {
    method: ['GET'],
    path: '/roles',
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
          resource_name: 'apiGetRolesRoute',
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
          role: joi.any().required()
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
    path: '/users',
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
          resource_name: 'apiGetUsersRoute',
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
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
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
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
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
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
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
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          role: joi.string().required()
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
    path: '/user/:id/role/:role',
    handler: 'UserController.addRole',
    config: {
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          role: joi.string().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiPostUserIdRoleRoleRoute',
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
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          role: joi.string().required()
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
    method: ['DELETE'],
    path: '/user/:id/role/:role',
    handler: 'UserController.removeRole',
    config: {
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          role: joi.string().required()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiDeleteUserIdRoleRoleRoute',
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
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          event: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
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
    path: '/users/search',
    handler: 'UserController.search',
    config: {
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.string(),
          term: joi.any()
        }
      },
      app: {
        proxyPermissions: {
          resource_name: 'apiGetUsersSearchRoute',
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
          // this will only ever be a string
          id: joi.string()
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
