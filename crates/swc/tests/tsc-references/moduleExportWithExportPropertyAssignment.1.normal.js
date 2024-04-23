//// [requires.d.ts]
//// [mod1.js]
/// <reference path='./requires.d.ts' />
module.exports = function() {};
/** @param {number} a */ module.exports.f = function(a) {};
//// [a.js]
/// <reference path='./requires.d.ts' />
var mod1 = require('./mod1');
mod1();
mod1.f() // error, not enough arguments
;
