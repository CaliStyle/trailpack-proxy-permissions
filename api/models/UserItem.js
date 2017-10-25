'use strict'

const Model = require('trails/model')

/**
 * @module UserItem
 * @description User Item
 */
module.exports = class UserItem extends Model {

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
        unique: 'user_item'
      },
      item: {
        type: Sequelize.STRING,
        unique: 'user_item',
      },
      item_id: {
        type: Sequelize.STRING,
        unique: 'user_item'
      }
    }
  }
}
