'use strict'

module.exports = {
  //Role name to use for anonymous users
  defaultRole: 'registered',
  // Name of the association field for Role under User model
  userRoleFieldName: 'roles',
  // add all models as resources in database on initialization
  modelsAsResources: true,
  // Initial data added when DB is empty
  fixtures: {
    roles: [
      {
        name: 'admin',
        publicName: 'Admin'
      }, {
        name: 'registered' ,
        publicName: 'Registered'
      }
    ],
    resources: [],
    permissions: []
  },
  // The default super admin username
  defaultAdminUsername: 'admin',
  // The default super admin password
  defaultAdminPassword: 'admin1234'
}
