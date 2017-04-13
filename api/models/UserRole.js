'use strict'

const Model = require('trails/model')

/**
 * @module UserRole
 * @description User Role
 */
module.exports = class UserRole extends Model {

  static config (app, Sequelize) {
    let config = {}
    if (app.config.database.orm === 'sequelize') {
      config = {
        options: {
          underscored: true
        }
      }
    }
    return config
  }

  static schema (app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'sequelize') {
      schema = {
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
    return schema
  }
}
