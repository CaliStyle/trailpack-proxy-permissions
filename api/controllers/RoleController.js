'use strict'

const Controller = require('trails/controller')
const Errors = require('proxy-engine-errors')

/**
 * @module RoleController
 * @description Generated Trails.js Controller.
 */
module.exports = class RoleController extends Controller {
  /**
   *
   * @param req
   * @param res
   */
  generalStats(req, res) {
    res.json({})
  }

  /**
   *
   * @param req
   * @param res
   */
  count(req, res){
    const ProxyEngineService = this.app.services.ProxyEngineService
    ProxyEngineService.count('Role')
      .then(count => {
        const counts = {
          carts: count
        }
        return res.json(counts)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  findOne(req, res) {
    const orm = this.app.orm
    const Role = orm['Role']
    const role = req.params.role

    Role.findOne({
      where: {
        name: role
      }
    })
      .then(role => {
        if (!role) {
          throw new Errors.FoundError(Error(`Role name '${ role }' not found`))
        }
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, role)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   *
   * @param req
   * @param res
   */
  findAll(req, res) {
    const orm = this.app.orm
    const Role = orm['Role']
    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = this.app.services.ProxyEngineService.jsonCritera(req.query.where)

    Role.findAndCount({
      order: sort,
      offset: offset,
      limit: limit,
      where: where
    })
      .then(roles => {
        this.app.services.ProxyEngineService.paginate(res, roles.count, limit, offset, sort)
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, roles.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}

