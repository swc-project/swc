import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @target: es6
// @filename: lateBoundAssignmentDeclarationSupport5.js
// currently unsupported
var _sym = Symbol();
var _str = "my-fake-sym";
function F() {}
var _obj;
F.prototype = (_obj = {}, swcHelpers.defineProperty(_obj, _sym, "ok"), swcHelpers.defineProperty(_obj, _str, "ok"), _obj);
var inst = new F();
var _y = inst[_str];
var _z = inst[_sym];
module.exports.F = F;
module.exports.S = _sym;
// @filename: usage.js
var x = require("./lateBoundAssignmentDeclarationSupport5.js");
var inst = new x.F();
var y = inst["my-fake-sym"];
var z = inst[x.S];
