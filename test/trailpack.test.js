'use strict'

const assert = require('assert')

describe('Trailpack', () => {
  let pack
  before(() => {
    pack = global.app.packs['proxy-permissions']
  })
  it('should be loaded into the app.packs collection', () => {
    assert(pack)
  })
  // describe('#validate', () => {
  //   it.skip('TODO test')
  // })
  // describe('#configure', () => {
  //   it.skip('TODO test')
  // })
  // describe('#initialize', () => {
  //   it.skip('TODO test')
  // })
})
