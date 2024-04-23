//// [mod.js]
module.exports = function x() {};
module.exports() // should be callable
;
//// [npm.js]
var mod = require('./mod');
mod() // should be callable from here too
;
