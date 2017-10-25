'use strict'

const Model = require('trails/model')

/**
 * @module UserRole
 * @description User Role
 */
module.exports = class UserRole extends Model {

  static config (app, Sequelize) {
    return {
      options: {
        underscored: true
      }
    }
  }

  static schema (app, Sequelize) {
    return {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        unique: 'user_role'
      },
      role_name: {
        type: Sequelize.STRING,
        unique: 'user_role'
      }
    }
  }
}
