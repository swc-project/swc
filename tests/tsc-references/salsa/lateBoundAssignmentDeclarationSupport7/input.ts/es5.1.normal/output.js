// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @target: es6
// @filename: lateBoundAssignmentDeclarationSupport7.js
var _sym = Symbol();
var _str = "my-fake-sym";
function F() {
}
F[_sym] = "ok";
F[_str] = "ok";
module.exports.F = F;
module.exports.S = _sym;
// @filename: usage.js
var x = require("./lateBoundAssignmentDeclarationSupport7.js");
var y = x.F["my-fake-sym"];
var z = x.F[x.S];
