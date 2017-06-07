'use strict'

var tmp = require('tmp')
var fs = require('fs')
var request = require('request')
var pify = require('pify')
var extract = pify(require('extract-zip'))
var config = require('./config')
var debug = require('debug')('iviews-bower-resolver:resolver')

/**
 * Exports the module definitions to handle the i-views bower components.
 *
 * @author jansorg
 */
module.exports = (function () {
  const SOURCE_REGEX = /^iviews:\/\/([a-zA-Z0-9_-]+)$/

  return {
    /**
     * Checks whether the url is supported. Supported urls have the form "iviews://<componentName>". The version
     * given in bower.json must be stripped by the caller, Bower does that automatically.
     * @param sourceUrl The url
     * @returns {boolean} true if the given sourceUrl is a valid i-views component url.
     */
    match: function (sourceUrl) {
      return SOURCE_REGEX.test(sourceUrl)
    },

    /**
     * @param {String} sourceUrl The url given in bower.json
     * @return {String} The name of the project extracted from the sourceUrl
     */
    project: function (sourceUrl) {
      let match = sourceUrl.match(SOURCE_REGEX)
      if (!match) {
        throw new Error(`Invalid source url '${sourceUrl}', must match ${SOURCE_REGEX}`)
      }
      return match[1]
    },

    /**
     * @param {String} project The project's name
     * @return {Promise} Returns a promise to list the version of the given project.
     *   The promise is resolved to the list of versions [{version:"", target:""}]
     */
    versionList: function (project) {
      return new Promise(function (resolve, reject) {
        var url = `${config.baseUrl}/${project}/metadata.json`
        debug(`Downloading version list from ${url}`)
        request({
          url: url,
          json: true
        }, function (error, response, json) {
          if (error) {
            return reject(error)
          }
          if (response.statusCode === 200 && json.versions) {
            resolve(json.versions.map(function (spec) {
              return {version: spec.version, target: spec.file}
            }))
          } else {
            reject(new Error('Unable to retrieve the versions from ' + url + ', status:' + response.statusCode))
          }
        })
      })
    },

    /**
     * Unzips the zip file defined by project and version into a new temporary directory. That directory is returned as the
     * result of a promise.
     *
     * @param {String} project The name of the project
     * @param {String} file the filename of the zip-file within the project directory (on the download server)
     * @return {Promise} A promise wich resolves to the temporary directory containing the unzipped archive
     */
    unzipToTmpDir: function (project, file) {
      return new Promise(function (resolve, reject) {
        var url = `${config.baseUrl}/${project}/${file}`

        var tmpDir = tmp.dirSync()
        var tmpFile = tmp.fileSync()

        debug(`Downloading version zip file from ${url}`)
        request({'url': url})
          .on('response', function (response) {
            if (response.statusCode !== 200) {
              reject(new Error('Unexpected status code for ' + url + ': ' + response.statusCode))
            }
          })
          .on('error', function (error) {
            reject(new Error('Error while executing request ' + url + ': ' + error))
          })
          .pipe(fs.createWriteStream(tmpFile.name))
          .on('error', function (error) {
            /* istanbul ignore next */
            reject(new Error('Error while unzipping the data at ' + url + ': ' + error))
          })
          .on('finish', function () {
            // called after the pipe call finished.
            resolve(extract(tmpFile.name, {dir: tmpDir.name}).then(() => tmpDir.name))
          })
      })
    }
  }
})()
