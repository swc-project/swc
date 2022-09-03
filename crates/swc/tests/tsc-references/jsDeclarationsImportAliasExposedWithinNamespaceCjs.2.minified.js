//// [file.js]
"use strict";
const myTypes = {};
exports.myTypes = myTypes;
//// [file2.js]
"use strict";
const { myTypes  } = require('./file.js'), testFnTypes = {};
function testFn(input) {
    return 'number' == typeof input ? 2 * input : null;
}
module.exports = {
    testFn,
    testFnTypes
};
