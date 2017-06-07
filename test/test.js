'use strict'

/* eslint-env mocha */

const resolver = require('../src/resolver.js')
const fs = require('fs')

const chai = require('chai')
const dircompare = require('dir-compare')
const nock = require('nock')
const config = require('../src/config')

chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
const expect = chai.expect

describe('The bower resolver', function () {
  describe('the "match"-method', function () {
    it('should accept "iviews"://viewconfigmapper as valid', function () {
      expect(resolver.match('iviews://viewconfigmapper')).to.be.true()
    })

    it('should reject "iviews"://viewconfigmapper/5.0.4 as invalid', function () {
      expect(resolver.match('iviews://viewconfigmapper/5.0.4')).to.be.false()
    })

    it('should reject "iviews":// as invalid', function () {
      expect(resolver.match('iviews://')).to.be.false()
    })

    it('should reject "http://viewconfigmapper" as invalid', function () {
      expect(resolver.match('http://viewconfigmapper')).to.be.false()
    })

    it('should reject "viewconfigmapper" as invalid', function () {
      expect(resolver.match('viewconfigmapper')).to.be.false()
    })
  })

  describe('the "project"-method"', function () {
    it('should return the project-name from the "iviews"://-url', function () {
      expect(resolver.project('iviews://viewconfigmapper')).to.equal('viewconfigmapper')
    })

    it('should reject invalid urls the project-name from the "iviews"://-url', function () {
      expect(() => resolver.project('iviews://viewconfigmapper/5.0.4')).to.throw(Error, /Invalid source url/)
    })
  })

  describe('The "versionList"-method', function () {
    it('should return the version list for the url', function () {
      nock(config.baseUrl)
        .get('/viewconfigmapper/metadata.json')
        .reply(200, {
          'versions': [
            {'version': '3.0.21', 'file': 'viewconfigmapper-3.0.21.zip'},
            {'version': '5.0.4', 'file': 'viewconfigmapper-5.0.4.zip'},
            {'version': '3.0.23', 'file': 'viewconfigmapper-3.0.23.zip'}
          ]
        })

      return expect(resolver.versionList('viewconfigmapper')).to.eventually.deep.equal(
        [
          {'target': 'viewconfigmapper-3.0.21.zip', 'version': '3.0.21'},
          {'target': 'viewconfigmapper-5.0.4.zip', 'version': '5.0.4'},
          {'target': 'viewconfigmapper-3.0.23.zip', 'version': '3.0.23'}
        ]
      )
    })

    it('should throw an error if the project does not exist', function () {
      nock(config.baseUrl)
        .get('/viewconfigmapper/metadata.json')
        .reply(404, {})

      return expect(resolver.versionList('viewconfigmapper')).to.be.rejectedWith(/Unable to retrieve the versions from/)
    })

    it('should throw an error if the project does not exist', function () {
      nock(config.baseUrl)
        .get('/viewconfigmapper/metadata.json')
        .replyWithError('something awful happened')

      return expect(resolver.versionList('viewconfigmapper')).to.be.rejectedWith(/something awful happened/)
    })
  })

  describe('The "unzipToTmpDir" method', function () {
    it('should unzip valid responses', function () {
      nock(config.baseUrl)
        .get('/viewconfigmapper/viewconfigmapper-5.0.4.zip')
        .reply(200, function (uri, requestBody) {
          return fs.createReadStream('test/fixture/file.zip')
        })

      let dirDiffs = resolver.unzipToTmpDir('viewconfigmapper', 'viewconfigmapper-5.0.4.zip')
        .then((tmpDir) => {
          return dircompare.compareSync('test/fixture/zip-content', tmpDir, {compareContent: true})
            .diffSet
            .filter(e => e.state !== 'equal')
        })

      return expect(dirDiffs).to.eventually.deep.equal([])
    })

    it('should reject broken zip files', function () {
      nock(config.baseUrl)
        .get('/viewconfigmapper/viewconfigmapper-5.0.4.zip')
        .reply(200, function (uri, requestBody) {
          return fs.createReadStream('test/fixture/zip-content/index.js')
        })

      return expect(resolver.unzipToTmpDir('viewconfigmapper', 'viewconfigmapper-5.0.4.zip')).to.be.rejectedWith(/end of central directory/)
    })

    it('should reject invalid responses', function () {
      nock(config.baseUrl)
        .get('/viewconfigmapper/viewconfigmapper-0.1.0.zip')
        .reply(404)

      return expect(resolver.unzipToTmpDir('viewconfigmapper', 'viewconfigmapper-0.1.0.zip')).to.be.rejectedWith(/Unexpected status code/)
    })

    it('should reject http-errors', function () {
      nock(config.baseUrl)
        .get('/viewconfigmapper/viewconfigmapper-0.1.0.zip')
        .replyWithError('something awful happened')

      return expect(resolver.unzipToTmpDir('viewconfigmapper', 'viewconfigmapper-0.1.0.zip')).to.be.rejectedWith(/something awful happened/)
    })
  })
})
