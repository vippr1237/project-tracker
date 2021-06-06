const glob = require('glob');

module.exports.getGlobbedFile = function(globPattern) {
    var output = [];
    let files = glob.sync(globPattern);

    output = files;

    return output
}