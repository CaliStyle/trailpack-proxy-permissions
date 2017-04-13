'use strict'

const Model = require('trails/model')

module.exports = class Resource extends Model {
  static config(app, Sequelize) {
    return {
      //More information about supported models options here : http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
      options: {
        underscored: true,
        classMethods: {
          associate: (models) => {
            models.Resource.hasMany(models.Permission, {
              as: 'permissions',
              onDelete: 'CASCADE',
              foreignKey: {
                name: 'resource_name',
                allowNull: false
              },
              constraints: false
            })
          }
        }
      }
    }
  }

  static schema(app, Sequelize) {
    return {
      type: {
        type: Sequelize.ENUM,
        values: ['model', 'controller', 'route', 'other'],
        defaultValue: 'other',
        allowNull: false
      },
      public_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      }
    }
  }
}
