// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @target: es6
// @filename: lateBoundAssignmentDeclarationSupport2.js
// currently unsupported
var _sym = Symbol();
var _str = "my-fake-sym";
module.exports[_sym] = "ok";
module.exports[_str] = "ok";
module.exports.S = _sym;
// @filename: usage.js
var x = require("./lateBoundAssignmentDeclarationSupport2.js");
var y = x["my-fake-sym"];
var z = x[x.S];
