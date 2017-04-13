'use strict'

const Model = require('trails/model')

module.exports = class Permission extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        underscored: true,
        classMethods: {
          associate: (models) => {
            models.Permission.belongsTo(models.Role, {
              as: 'role',
              onDelete: 'CASCADE',
              // foreignKey: 'role_name',
              foreignKey: {
                primaryKey: true,
                name: 'role_name',
                allowNull: false
              },
              constraints: false
            })
            models.Permission.belongsTo(models.Resource, {
              as: 'resource',
              onDelete: 'CASCADE',
              // foreignKey: 'resource_name',
              foreignKey: {
                primaryKey: true,
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
      action: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      relation: {
        type: Sequelize.ENUM,
        values: ['owner','owners']
      }
    }
  }
}
