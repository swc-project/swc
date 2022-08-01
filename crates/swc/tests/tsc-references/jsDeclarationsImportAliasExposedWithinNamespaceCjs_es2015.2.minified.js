exports.myTypes = {};
const { myTypes  } = require('./file.js');
module.exports = {
    testFn: function(input) {
        return 'number' == typeof input ? 2 * input : null;
    },
    testFnTypes: {}
};
