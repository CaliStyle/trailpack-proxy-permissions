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
          model: this.app.orm['Roles'],
          as: 'roles'
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
    const where = this.app.services.ProxyCartService.jsonCritera(req.query.where)

    User.findAndCount({
      order: sort,
      offset: offset,
      limit: limit,
      where: where,
      include: [
        {
          model: this.app.orm['Passport'],
          as: 'passports'
        },
        {
          model: this.app.orm['Roles'],
          as: 'roles'
        }
      ]
    })
      .then(users => {
        res.set('X-Pagination-Total', users.count)
        res.set('X-Pagination-Pages', Math.ceil(users.count / limit))
        res.set('X-Pagination-Page', offset == 0 ? 1 : Math.round(offset / limit))
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
}

