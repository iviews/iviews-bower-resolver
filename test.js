'use strict';

var resolver = require("./src/resolver.js");

// resolver.unzipToTmpDir("iviews://viewconfigmapper/5.0.1").then(function(path) {
//     console.log(path);
// });

resolver.versionList(resolver.project("iviews://viewconfigmapper/5.0.4"), resolver.version("iviews://viewconfigmapper#5.0.4")).then(function(json) {
    console.log(JSON.stringify(json));
}, function(error) {
    console.log(error);
});