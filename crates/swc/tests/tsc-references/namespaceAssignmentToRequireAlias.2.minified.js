//// [node_modules/untyped/index.js]
module.exports = {};
//// [bug40140.js]
var u = require('untyped');
u.assignment.nested = !0, u.noError();
