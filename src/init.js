'use strict';

var iviews = require('./resolver');

/**
 * Defines a Bower resolver as defined at https://bower.io/docs/pluggable-resolvers/ .
 * @param bower
 */
module.exports = function resolver(bower) {
    return {
        /**
         * Match method tells whether resolver supports given source
         * It can return either boolean or promise of boolean
         */
        match: function(source) {
            return iviews.match(source);
        },

        /**
         * Allows to list available versions of given source.
         * Bower chooses matching release and passes it to "fetch"
         */
        releases: function(source) {
            return iviews.versionList(iviews.project(source)).then(function(json) {
                return json;
            });
        },

        /**
         * It downloads package and extracts it to temporary directory
         * You can use npm's "tmp" package to tmp directories
         * See the "Resolver API" section for details on this method
         */
        fetch: function(endpoint, cached) {
            // If cached version of package exists, re-use it
            if (cached && cached.version) {
                return;
            }

            // unzip the data to a temporary directory
            return iviews.unzipToTmpDir(iviews.project(endpoint.source), endpoint.target)
                .then(function(tempDirName) {
                    return {
                        tempPath: tempDirName,
                        removeIgnores: true
                    };
                });
        }
    }
};