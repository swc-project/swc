//// [module.js]
var Outer = function(element, config) {};
//// [usage.js]
Outer.Pos = function(line, ch) {}, Outer.Pos.prototype.line;
var pos = new Outer.Pos(1, 'x');
pos.line;
