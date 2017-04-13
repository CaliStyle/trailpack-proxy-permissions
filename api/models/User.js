'use strict'

const Model = require('trails/model')

module.exports = class User extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        underscored: true,
        classMethods: {
          associate: (models) => {
            models.User.belongsToMany(models.Role, {
              as: 'roles',
              through: {
                model: models.UserRole,
                foreignKey: 'user_id'
              },
              constraints: false
            })
          }
        }
      }
    }
  }

  static schema(app, Sequelize) {

  }
}
