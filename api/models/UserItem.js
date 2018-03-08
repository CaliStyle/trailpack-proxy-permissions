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
      // Record ID
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // User ID
      user_id: {
        type: Sequelize.INTEGER,
        unique: 'user_item'
      },
      // Model name
      item: {
        type: Sequelize.STRING,
        unique: 'user_item',
      },
      // Model record id
      item_id: {
        type: Sequelize.STRING,
        unique: 'user_item'
      }
      // access: {
      //   type: Sequelize.ENUM,
      //   values: [1,2,3,4,5,6,7],
      //   defaultValue: 7
      // }
    }
  }
}
