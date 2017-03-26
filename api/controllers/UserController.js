'use strict'

const Controller = require('trails/controller')

/**
 * @module UserController
 * @description Generated Trails.js Controller.
 */
module.exports = class UserController extends Controller {
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

