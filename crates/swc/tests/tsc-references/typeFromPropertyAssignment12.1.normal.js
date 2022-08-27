//// [module.js]
var Outer = function(element, config) {};
//// [usage.js]
/** @constructor */ Outer.Pos = function(line, ch) {};
/** @type {number} */ Outer.Pos.prototype.line;
var pos = new Outer.Pos(1, 'x');
pos.line;
