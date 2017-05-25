/* eslint no-console: [0] */

'use strict'

const Service = require('trails/service')
const csvParser = require('babyparse')
const _ = require('lodash')
const shortid = require('shortid')
const fs = require('fs')
const USER_UPLOAD = require('../utils/enums').USER_UPLOAD

/**
 * @module UserCsvService
 * @description User CSV Service
 */
module.exports = class UserCsvService extends Service {
  /**
   *
   * @param file
   * @returns {Promise}
   */
  userCsv(file) {
    // TODO validate csv
    console.time('csv')
    const uploadID = shortid.generate()
    const ProxyEngineService = this.app.services.ProxyEngineService

    return new Promise((resolve, reject)=>{
      const options = {
        header: true,
        dynamicTyping: true,
        step: (results, parser) => {
          // console.log(parser)
          // console.log('Row data:', results.data)
          // TODO handle errors
          // console.log('Row errors:', results.errors)
          parser.pause()
          return this.csvUserRow(results.data[0], uploadID)
            .then(row => {
              parser.resume()
            })
            .catch(err => {
              console.log(err)
              parser.resume()
            })
        },
        complete: (results, file) => {
          console.timeEnd('csv')
          // console.log('Parsing complete:', results, file)
          results.upload_id = uploadID
          ProxyEngineService.count('UserUpload', { where: { upload_id: uploadID }})
            .then(count => {
              results.users = count
              // Publish the event
              ProxyEngineService.publish('user_upload.complete', results)
              return resolve(results)
            })
            // TODO handle this more gracefully
            .catch(err => {
              return reject(err)
            })
        },
        error: (err, file) => {
          return reject(err)
        }
      }
      const fileString = fs.readFileSync(file, 'utf8')
      // Parse the CSV/TSV
      csvParser.parse(fileString, options)
    })
  }

  /**
   *
   * @param row
   * @param uploadID
   */
  csvUserRow(row, uploadID) {
    // console.log(row)
    const UserUpload = this.app.orm.UserUpload
    const values = _.values(USER_UPLOAD)
    const keys = _.keys(USER_UPLOAD)
    const upload = {
      upload_id: uploadID,
      options: {}
    }

    _.each(row, (data, key) => {
      if (data === '') {
        row[key] = null
      }
    })

    row = _.omitBy(row, _.isNil)

    if (_.isEmpty(row)) {
      return Promise.resolve({})
    }

    _.each(row, (data, key) => {
      if (data !== '') {
        const i = values.indexOf(key.replace(/^\s+|\s+$/g, ''))
        const k = keys[i]
        if (i > -1 && k) {
          if (k == 'roles') {
            upload[k] = data.split(',').map(role => { return role.trim()})
          }
          else {
            upload[k] = data
          }
        }
      }
    })
    // console.log('YO SCOTT', upload)

    const newUser = UserUpload.build(upload)
    return newUser.save()
  }

  /**
   *
   * @param uploadId
   * @returns {Promise}
   */
  processUserUpload(uploadId) {
    return new Promise((resolve, reject) => {
      const UserUpload = this.app.orm.UserUpload
      let usersTotal = 0
      UserUpload.batch({
        where: {
          upload_id: uploadId
        }
      }, users => {
        const Sequelize = this.app.orm.User.sequelize

        return Sequelize.Promise.mapSeries(users, user => {

          const create = {
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
            // roles: user.roles
          }
          return this.app.orm['User'].create(create)
          // return this.app.services.UserService.create(create)
        })
          .then(results => {
            // Calculate Totals
            usersTotal = usersTotal + results.length
            return results
          })
      })
        .then(results => {
          return UserUpload.destroy({where: {upload_id: uploadId }})
        })
        .then(destroyed => {
          const results = {
            upload_id: uploadId,
            users: usersTotal
          }
          this.app.services.ProxyEngineService.publish('user_process.complete', results)
          return resolve(results)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

