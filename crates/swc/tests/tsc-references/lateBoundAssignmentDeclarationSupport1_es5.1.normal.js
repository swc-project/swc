// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @target: es6
// @filename: lateBoundAssignmentDeclarationSupport1.js
// currently unsupported
var _sym = Symbol();
var _str = "my-fake-sym";
exports[_sym] = "ok";
exports[_str] = "ok";
exports.S = _sym;
// @filename: usage.js
var x = require("./lateBoundAssignmentDeclarationSupport1.js");
var y = x["my-fake-sym"];
var z = x[x.S];
