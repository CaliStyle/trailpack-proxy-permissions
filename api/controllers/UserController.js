/* eslint no-console: [0] */
'use strict'

const Controller = require('trails/controller')
// const lib = require('../../lib')
const Errors = require('proxy-engine-errors')
const _ = require('lodash')
/**
 * @module UserController
 * @description Generated Trails.js Controller.
 */
module.exports = class UserController extends Controller {
  generalStats(req, res) {
    res.json({})
  }
  /**
   * count the amount of user
   * @param req
   * @param res
   */
  count(req, res){
    const ProxyEngineService = this.app.services.ProxyEngineService
    ProxyEngineService.count('User')
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
  findById(req, res) {
    const orm = this.app.orm
    const User = orm['User']
    let id = req.params.id
    if (!id && req.user) {
      id = req.user.id
    }
    User.findById(id, {
      include: [
        {
          model: this.app.orm['Passport'],
          as: 'passports'
        },
        {
          model: this.app.orm['Role'],
          as: 'roles'
        },
        {
          model: this.app.orm['Event'],
          as: 'events'
        }
      ]
    })
      .then(user => {
        if (!user) {
          throw new Errors.FoundError(Error(`User id ${id} not found`))
        }
        return res.json(user)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  findAll(req, res) {
    const orm = this.app.orm
    const User = orm['User']
    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || 'created_at DESC'
    const where = this.app.services.ProxyPermissionsService.jsonCritera(req.query.where)

    User.findAndCount({
      order: sort,
      offset: offset,
      limit: limit,
      where: where,
      include: [
        {
          model: this.app.orm['Role'],
          as: 'roles'
        }
      ]
    })
      .then(users => {
        res.set('X-Pagination-Total', users.count)
        res.set('X-Pagination-Pages', Math.ceil(users.count / limit))
        res.set('X-Pagination-Page', offset == 0 ? 1 : Math.round(offset / limit))
        res.set('X-Pagination-Offset', offset)
        res.set('X-Pagination-Limit', limit)
        res.set('X-Pagination-Sort', sort)
        return res.json(users.rows)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  update(req, res) {
    // const UserService = this.app.services.UserService
    let id = req.params.id
    if (!id && req.user) {
      id = req.user.id
    }
    // console.log('this user',id, req.user)
    this.app.orm['User'].findById(id)
      .then(user => {

        if (!user) {
          const err = new Error(`User ${id} not found`)
          err.code = 404
          throw err
        }
        user = _.extend(user, req.body)
        return user.save()
      })
      .then(user => {
        return res.json(user)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   * upload CSV
   * @param req
   * @param res
   */
  uploadCSV(req, res) {
    const UserCsvService = this.app.services.UserCsvService
    const csv = req.file

    if (!csv) {
      const err = new Error('File failed to upload')
      return res.serverError(err)
    }

    UserCsvService.userCsv(csv.path)
      .then(result => {
        return res.json({
          file: req.file,
          result: result
        })
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
  processUpload(req, res) {
    const UserCsvService = this.app.services.UserCsvService
    UserCsvService.processUserUpload(req.params.id)
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
  exportUsers(req, res) {
    //
  }
  roles(req, res) {
    const Role = this.app.orm['Role']
    const userId = req.params.id

    if (!userId && !req.user) {
      const err = new Error('A user id and a user in session are required')
      return res.send(401, err)
    }

    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || 'created_at DESC'

    Role.findAndCount({
      order: sort,
      where: {
        user_id: userId
      },
      offset: offset,
      limit: limit
    })
      .then(roles => {
        res.set('X-Pagination-Total', roles.count)
        res.set('X-Pagination-Pages', Math.ceil(roles.count / limit))
        res.set('X-Pagination-Page', offset == 0 ? 1 : Math.round(offset / limit))
        res.set('X-Pagination-Limit', limit)
        res.set('X-Pagination-Sort', sort)
        return res.json(roles.rows)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  addRole(req, res) {
    this.app.services.PermissionService.addRoleToUser(req.params.id, req.params.role)
      .then(user => {
        return res.json(user)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  removeRole(req, res) {
    this.app.services.PermissionService.removeRoleFromUser(req.params.id, req.params.role)
      .then(user => {
        return res.json(user)
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
  event(req, res) {
    const Event = this.app.orm['Event']
    const eventId = req.params.event
    const userId = req.params.id

    if (!userId || !eventId || !req.user) {
      const err = new Error('A user id and a user in session are required')
      res.send(401, err)

    }
    Event.findById(eventId)
      .then(event => {
        return res.json(event)
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
  events(req, res) {
    const Event = this.app.orm['Event']
    const userId = req.params.id

    if (!userId && !req.user) {
      const err = new Error('A user id and a user in session are required')
      return res.send(401, err)
    }

    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || 'created_at DESC'

    Event.findAndCount({
      order: sort,
      where: {
        object_id: userId,
        object: 'user'
      },
      offset: offset,
      limit: limit
    })
      .then(events => {
        res.set('X-Pagination-Total', events.count)
        res.set('X-Pagination-Pages', Math.ceil(events.count / limit))
        res.set('X-Pagination-Page', offset == 0 ? 1 : Math.round(offset / limit))
        res.set('X-Pagination-Limit', limit)
        res.set('X-Pagination-Sort', sort)
        return res.json(events.rows)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

}

