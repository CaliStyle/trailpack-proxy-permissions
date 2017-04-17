'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')

describe('UserController', () => {
  let request, agent, uploadID, userID

  before((done) => {
    request = supertest('http://localhost:3000')
    agent = supertest.agent(global.app.packs.express.server)

    agent
      .post('/api/auth/local')
      .set('Accept', 'application/json') //set header for this test
      .send({username: 'admin', password: 'admin1234'})
      .expect(200)
      .end((err, res) => {
        userID = res.body.user.id
        console.log(res.body)
        done()
      })
  })

  it('should exist', () => {
    assert(global.app.api.controllers['UserController'])
  })

  it('It should update the user\'s name', (done) => {
    agent
      .post('/api/user')
      .set('Accept', 'application/json') //set header for this test
      .send({
        email: 'scott@scott.com'
      })
      .expect(200)
      .end((err, res) => {
        // console.log('THIS USER',res.body)
        assert.equal(res.body.email, 'scott@scott.com')
        done()
      })
  })
  it('It should upload collection_upload.csv', (done) => {
    agent
      .post('/api/user/uploadCSV')
      .attach('csv', 'test/fixtures/user_upload.csv')
      .expect(200)
      .end((err, res) => {
        // console.log('upload body',res.body)
        assert.ok(res.body.result.upload_id)
        uploadID = res.body.result.upload_id
        assert.equal(res.body.result.users, 1)
        done()
      })
  })
  it.skip('It should process upload', (done) => {
    // console.log('UPLOAD ID', uploadID)
    agent
      .post(`/api/user/processUpload/${ uploadID }`)
      .send({})
      .expect(200)
      .end((err, res) => {
        console.log('process upload body', res.body)
        assert.equal(res.body.users, 1)
        done()
      })
  })
  it('It should get all users', (done) => {
    agent
      .get('/api/user')
      .set('Accept', 'application/json') //set header for this test
      .expect(200)
      .end((err, res) => {
        // console.log('THIS USERs',res.body)
        done()
      })
  })
  it('It should get user by id', (done) => {
    agent
      .get(`/api/user/${ userID }`)
      .set('Accept', 'application/json') //set header for this test
      .expect(200)
      .end((err, res) => {
        // console.log('THIS USER',res.body)
        done()
      })
  })
})
