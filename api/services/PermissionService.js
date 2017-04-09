'use strict'

const Service = require('trails/service')
const _ = require('lodash')

module.exports = class PermissionService extends Service {
  /**
   *
   * @param roleName
   * @returns {Promise.<T>|*}
   */
  findRole(roleName) {
    return this.app.services.FootprintService.find('role', roleName)
  }

  /**
   *
   * @param resource_name
   * @returns {T|*}
   */
  findResource(resourceName) {
    return this.app.services.FootprintService.find('resource', resourceName)
  }

  /**
   *
   * @param roleName
   * @param resource_name
   * @param actionName
   * @param relation
   * @returns {permission}
   */
  grant(roleName, resourceName, actionName, relation) {
    return this.app.services.FootprintService.create('permission', {
      role_name: roleName,
      resource_name: resourceName,
      action: actionName,
      relation: relation || null
    }, {findOne: true})
  }

  /**
   *
   * @param roleName
   * @param resource_name
   * @param actionName
   * @returns {*}
   */
  revoke(roleName, resourceName, actionName) {
    return this.app.services.FootprintService.destroy('permission', {
      role_name: roleName,
      resource_name: resourceName,
      action: actionName
    })
  }

  /**
   *
   * @param roleName
   * @param resource_name
   * @param actionName
   * @returns {T|*}
   */
  isAllowed(roleName, resourceName, actionName) {
    return this.app.services.FootprintService.find('permission', {
      role_name: roleName,
      resource_name: resourceName,
      action: actionName
    }, {findOne: true})
  }

  /**
   *
   * @param user
   * @param resource_name
   * @param actionName
   * @returns {Promise.<TResult>|*}
   */
  isUserAllowed(user, resourceName, actionName) {
    return this.app.services.FootprintService.findAssociation('user', user.id,
      _.get(this.app.config, 'permissions.userRoleFieldName', 'roles'))
      .then(roles => {
        const promises = []
        roles.forEach(role => {
          promises.push(this.isAllowed(role.name, resourceName, actionName))
        })
        return Promise.all(promises).then(permissions => {
          const perms = []
          permissions.forEach(perm => {
            if (perm != null) {
              perms.push(perm)
            }
          })
          return Promise.resolve(perms)
        })
      })
  }

  /**
   *
   * @param user
   * @param roleName
   */
  addRoleToUser(user, roleName) {
    user.addRole(roleName)
    return user.save()
  }

  /**
   *
   * @param user
   * @param roleName
   */
  removeRoleToUser(user, roleName) {
    user.removeRole(roleName)
    return user.save()
  }
}
