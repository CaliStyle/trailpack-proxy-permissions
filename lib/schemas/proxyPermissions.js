const joi = require('joi')

module.exports = joi.object().keys({
  defaultRole: joi.string(),
  defaultRegisteredRole: joi.string(),
  userRoleFieldName: joi.string().required(),
  modelsAsResources: joi.boolean().required(),
  fixtures: joi.object().keys({
    roles: joi.array(),
    resources: joi.array(),
    permissions: joi.array()
  }).required(),
  defaultAdminUsername: joi.string().required(),
  defaultAdminPassword: joi.string().required()
})
