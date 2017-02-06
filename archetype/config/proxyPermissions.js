'use strict'

module.exports = {
  //Role name to use for anonymous users
  defaultRole: null,
  // Name of the association field for Role under User model
  userRoleFieldName: 'roles',
  // add all models as resources in database on initialization
  modelsAsResources: true,
  //Initial data added when DB is empty
  fixtures: {
    roles: [],
    resources: [],
    permissions: []
  }
}
