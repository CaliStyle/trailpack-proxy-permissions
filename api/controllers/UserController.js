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
      ],
      order: [
        [
          {
            model: this.app.orm['Event'],
            as: 'events'
          },
          'created_at', 'DESC'
        ]
      ]
    })
      .then(user => {
        if (!user) {
          throw new Errors.FoundError(Error(`User id ${id} not found`))
        }
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, user)
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
    const User = orm['User']
    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || [['created_at','DESC']]
    const where = this.app.services.ProxyEngineService.jsonCritera(req.query.where)

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
        this.app.services.ProxyEngineService.paginate(res, users.count, limit, offset, sort)
        // return res.json(users.rows)
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, users.rows)
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
  search(req, res) {
    const orm = this.app.orm
    const User = orm['User']
    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || [['created_at', 'DESC']]
    const term = req.query.term

    User.findAndCount({
      order: sort,
      offset: offset,
      limit: limit,
      where: {
        $or: [
          {
            email: {
              $iLike: `%${term}%`
            }
          },
          {
            username: {
              $iLike: `%${term}%`
            }
          }
          // {
          //   first_name: {
          //     $like: `%${term}%`
          //   }
          // },
          // {
          //   last_name: {
          //     $like: `%${term}%`
          //   }
          // }
        ]
      },
      include: [
        {
          model: this.app.orm['Role'],
          as: 'roles'
        }
      ]
    })
      .then(users => {
        this.app.services.ProxyEngineService.paginate(res, users.count, limit, offset, sort)
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, users.rows)
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
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, user)
      })
      .then(result => {
        return res.json(result)
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

  /**
   *
   * @param req
   * @param res
   */
  roles(req, res) {
    // const Role = this.app.orm['Role']
    let userId = req.params.id

    if (!userId && !req.user) {
      const err = new Error('A user id and a user in session are required')
      return res.send(401, err)
    }
    if (!userId) {
      userId = req.user.id
    }

    const orm = this.app.orm
    const Role = orm['Role']
    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || [['created_at', 'DESC']]

    Role.findAndCount({
      order: sort,
      offset: offset,
      limit: limit,
      where: {
        '$users.id$': userId,
      },
      include: [
        {
          model: this.app.orm['User'],
          as: 'users',
          attributes: ['id'],
          duplicating: false
        }
      ]
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

  /**
   *
   * @param req
   * @param res
   */
  addRole(req, res) {
    this.app.services.PermissionService.addRoleToUser(req.params.id, req.params.role)
      .then(user => {
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, user)
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
  removeRole(req, res) {
    this.app.services.PermissionService.removeRoleFromUser(req.params.id, req.params.role)
      .then(user => {
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, user)
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
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, event)
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
  events(req, res) {
    const Event = this.app.orm['Event']
    const userId = req.params.id

    if (!userId && !req.user) {
      const err = new Error('A user id and a user in session are required')
      return res.send(401, err)
    }

    const limit = req.query.limit || 10
    const offset = req.query.offset || 0
    const sort = req.query.sort || [['created_at', 'DESC']]

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
        this.app.services.ProxyEngineService.paginate(res, events.count, limit, offset, sort)
        return this.app.services.ProxyPermissionsService.sanitizeResult(req, events.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}

