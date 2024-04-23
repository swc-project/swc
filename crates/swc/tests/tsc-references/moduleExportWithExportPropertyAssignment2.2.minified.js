//// [requires.d.ts]
//// [mod1.js]
module.exports = 1, module.exports.f = function() {};
//// [a.js]
var mod1 = require('./mod1');
mod1.toFixed(12), mod1.f();
