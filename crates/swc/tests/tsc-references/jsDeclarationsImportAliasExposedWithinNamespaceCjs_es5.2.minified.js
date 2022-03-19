var myTypes = {};
exports.myTypes = myTypes;
var myTypes = require('./file.js').myTypes;
module.exports = {
    testFn: function(input) {
        return 'number' == typeof input ? 2 * input : null;
    },
    testFnTypes: {}
};
