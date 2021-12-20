// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @target: es6
// @filename: lateBoundAssignmentDeclarationSupport4.js
// currently unsupported
var _sym = Symbol();
var _str = "my-fake-sym";
function F() {
}
F.prototype[_sym] = "ok";
F.prototype[_str] = "ok";
var inst = new F();
var _y = inst[_str];
var _z = inst[_sym];
module.exports.F = F;
module.exports.S = _sym;
// @filename: usage.js
var x = require("./lateBoundAssignmentDeclarationSupport4.js");
var inst = new x.F();
var y = inst["my-fake-sym"];
var z = inst[x.S];
