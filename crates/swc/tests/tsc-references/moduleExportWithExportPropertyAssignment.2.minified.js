//// [requires.d.ts]
//// [mod1.js]
module.exports = function() {}, module.exports.f = function(a) {};
//// [a.js]
var mod1 = require('./mod1');
mod1(), mod1.f();
