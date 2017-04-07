'use strict';

var tmp = require('tmp');
var request = require('request');
var unzip = require('unzip-stream');

/**
 * Exports the module definitions to handle the i-views bower components.
 *
 * @author jansorg
 */
module.exports = (function() {
    const SOURCE_REGEX = /^iviews:\/\/([a-zA-Z0-9_-]+)$/;

    return {
        /**
         * Checks whether the url is supported. Supported urls have the form "iviews://<componentName>". The version
         * given in bower.json must be stripped by the caller, Bower does that automatically.
         * @param sourceUrl The url
         * @returns {boolean} true if the given sourceUrl is a valid i-views component url.
         */
        match: function(sourceUrl) {
            return SOURCE_REGEX.test(sourceUrl);
        },

        /**
         * @param {String} sourceUrl The url given in bower.json
         * @return {String} The name of the project extracted from the sourceUrl
         */
        project: function(sourceUrl) {
            return sourceUrl.match(SOURCE_REGEX)[1];
        },

        /**
         * @param {String} project The project's name
         * @return {Promise} Returns a promise to list the version of the given project. The promise is resolved to the list of versions [{version:"", target:""}]
         */
        versionList: function(project) {
            return new Promise(function(resolve, reject) {
                var url = "http://localhost:4000/bower/" + project + "/version";

                request({
                    url: url,
                    json: true
                }, function(error, response, json) {
                    if (response.statusCode == 200 && json.versions) {
                        resolve(json.versions.map(function(spec) {
                            return {version: spec.version, target: spec.version};
                        }));
                    } else {
                        reject("Unable to retrieve the versions from " + url + ", status:" + response.statusCode);
                    }
                });
            });
        },

        /**
         * @param {String} project The name of the project
         * @return {Promise} A promise wich resolves to the temporary directory containing the unzipped archive
         */
        unzipToTmpDir: function(project, targetVersion) {
            return new Promise(function(resolve, reject) {
                var url = "http://localhost:4000/bower/" + project + "/version/" + targetVersion;
                var tmpDir = tmp.dirSync();

                request({"url": url})
                    .on('response', function(response) {
                        if (response.statusCode !== 200) {
                            throw new Error("Unexpected status code for " + url + ": " + response.statusCode);
                        }
                    })
                    .on('error', function(error) {
                        reject("Error while unzipping the data at " + url + ": " + error);
                    })
                    .pipe(unzip.Extract({path: tmpDir.name}))
                    .on('finish', function() {
                        //called after the pipe call finished.
                        resolve(tmpDir.name);
                    });
            });
        }
    }
})();