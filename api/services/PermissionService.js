/* eslint no-console: [0] */
'use strict'

const Service = require('trails/service')
// const _ = require('lodash')

module.exports = class PermissionService extends Service {
  /**
   *
   * @param roleName
   * @returns {Promise.<T>|*}
   */
  findRole(roleName) {
    return this.app.orm['Role']
      .findOne({
        where: {
          name: roleName
        }
      })
  }

  /**
   *
   * @param resource_name
   * @returns {T|*}
   */
  findResource(resourceName) {
    return this.app.orm['Resource']
      .findOne({
        where: {
          name: resourceName
        }
      })
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
    return this.app.orm['Permission']
      .create({
        role_name: roleName,
        resource_name: resourceName,
        action: actionName,
        relation: relation || null
      })
  }

  /**
   *
   * @param roleName
   * @param resource_name
   * @param actionName
   * @returns {*}
   */
  revoke(roleName, resourceName, actionName) {
    return this.app.orm['Permission'].destroy({
      where: {
        role_name: roleName,
        resource_name: resourceName,
        action: actionName
      }
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
    return this.app.orm['Permission'].findOne({
      where: {
        role_name: roleName,
        resource_name: resourceName,
        action: actionName
      }
    })
  }

  /**
   *
   * @param user
   * @param resourceName
   * @param actionName
   * @returns {Promise.<TResult>|*}
   */
  isUserAllowed(user, resourceName, actionName) {
    // _.get(this.app.config, 'permissions.userRoleFieldName', 'roles')
    return this.app.services.ProxyPermissionsService.resolveUser(user)
      .then(user => {
        return user.getRoles()
      })
      .then(roles => {
        const promises = []
        roles.forEach(role => {
          promises.push(this.isAllowed(role.name, resourceName, actionName))
        })
        return Promise.all(promises).then(permissions => {
          // console.log('This permissions',permissions)
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
  addRoleToUser(user, roleName, options) {
    if (!options) {
      options = {}
    }
    let resUser
    return this.app.services.ProxyPermissionsService.resolveUser(user, options)
      .then(user => {
        resUser = user
        return resUser.hasRole(roleName, {transaction: options.transaction || null})
      })
      .then(hasRole => {
        if (!hasRole) {
          console.log('NO ROLE')
          return resUser.addRole(roleName, {transaction: options.transaction || null})
        }
        return resUser
      })
      .then(() => {
        return resUser.reload({transaction: options.transaction || null})
      })
  }

  /**
   *
   * @param user
   * @param roleName
   */
  removeRoleFromUser(user, roleName, options) {
    if (!options) {
      options = {}
    }
    let resUser
    return this.app.services.ProxyPermissionsService.resolveUser(user, options)
      .then(user => {
        resUser = user
        return resUser.hasRole(roleName, {transaction: options.transaction || null})
      })
      .then(hasRole => {
        if (hasRole) {
          return resUser.removeRole(roleName, {transaction: options.transaction || null})
        }
        return resUser
      })
      .then(() => {
        return resUser.reload({transaction: options.transaction || null})
      })
  }
}
