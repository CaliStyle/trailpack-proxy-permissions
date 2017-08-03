/* eslint no-console: [0] */
'use strict'

const Service = require('trails/service')
// const _ = require('lodash')

module.exports = class PermissionService extends Service {
  /**
   *
   * @param roleName
   * @param options
   * @returns {Promise.<T>|*}
   */
  findRole(roleName, options) {
    options = options || {}
    return this.app.orm['Role']
      .findOne({
        where: {
          name: roleName
        },
        transaction: options.transaction || null
      })
  }

  /**
   *
   * @param resourceName
   * @param options
   * @returns {Promise.<T>|*}
   */
  findResource(resourceName, options) {
    options = options || {}
    return this.app.orm['Resource']
      .findOne({
        where: {
          name: resourceName
        },
        transaction: options.transaction || null
      })
  }

  /**
   *
   * @param roleName
   * @param resourceName
   * @param actionName
   * @param relation
   * @param options
   * @returns {permission}
   */
  grant(roleName, resourceName, actionName, relation, options) {
    options = options || {}
    return this.app.orm['Permission']
      .create({
        role_name: roleName,
        resource_name: resourceName,
        action: actionName,
        relation: relation || null
      }, {
        transaction: options.transaction || null
      })
  }

  /**
   *
   * @param roleName
   * @param resourceName
   * @param actionName
   * @param options
   * @returns {*}
   */
  revoke(roleName, resourceName, actionName, options) {
    options = options || {}
    return this.app.orm['Permission'].destroy({
      where: {
        role_name: roleName,
        resource_name: resourceName,
        action: actionName
      },
      transaction: options.transaction || null
    })
  }

  /**
   *
   * @param roleName
   * @param resourceName
   * @param actionName
   * @param options
   * @returns {T|*}
   */
  isAllowed(roleName, resourceName, actionName, options) {
    options = options || {}
    return this.app.orm['Permission'].findOne({
      where: {
        role_name: roleName,
        resource_name: resourceName,
        action: actionName
      },
      transaction: options.transaction || null
    })
  }

  /**
   *
   * @param user
   * @param resourceName
   * @param actionName
   * @param options
   * @returns {Promise.<TResult>|*}
   */
  isUserAllowed(user, resourceName, actionName, options) {
    options = options || {}
    // _.get(this.app.config, 'permissions.userRoleFieldName', 'roles')
    return this.app.orm['User'].resolve(user, {transaction: options.transaction || null})
      .then(user => {
        return user.getRoles({transaction: options.transaction || null})
      })
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
   * @param options
   */
  addRoleToUser(user, roleName, options) {
    options = options || {}
    const User = this.app.orm['User']
    let resUser
    return User.resolve(user, { transaction: options.transaction || null })
      .then(user => {
        resUser = user
        return resUser.resolveRoles({transaction: options.transaction || null})
      })
      .then(() => {
        return resUser.hasRole(roleName, {transaction: options.transaction || null})
      })
      .then(hasRole => {
        if (!hasRole) {
          return resUser.addRole(roleName, {transaction: options.transaction || null})
            .then(() => resUser.getRoles({transaction: options.transaction || null}))
        }
        return resUser.roles
      })
      .then(roles => {
        resUser.roles = roles
        resUser.setDataValue('roles', roles)
        resUser.set('roles', roles)
        return resUser
      })
  }

  /**
   *
   * @param user
   * @param roleName
   * @param options
   */
  removeRoleFromUser(user, roleName, options) {
    options = options || {}
    const User = this.app.orm['User']
    let resUser
    return User.resolve(user, { transaction: options.transaction || null })
      .then(user => {
        resUser = user
        return resUser.resolveRoles({transaction: options.transaction || null})
      })
      .then(() => {
        return resUser.hasRole(roleName, {transaction: options.transaction || null})
      })
      .then(hasRole => {
        if (hasRole) {
          return resUser.removeRole(roleName, {transaction: options.transaction || null})
            .then(() => resUser.getRoles({transaction: options.transaction || null}))
        }
        return resUser.roles
      })
      .then(roles => {
        resUser.roles = roles
        resUser.setDataValue('roles', roles)
        resUser.set('roles', roles)
        return resUser
      })
  }
}
