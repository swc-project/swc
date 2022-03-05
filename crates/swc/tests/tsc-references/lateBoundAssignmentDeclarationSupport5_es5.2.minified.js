import * as swcHelpers from "@swc/helpers";
var _obj, _sym = Symbol(), _str = "my-fake-sym";
function F() {}
F.prototype = (_obj = {}, swcHelpers.defineProperty(_obj, _sym, "ok"), swcHelpers.defineProperty(_obj, _str, "ok"), _obj);
var inst = new F();
inst[_str], inst[_sym], module.exports.F = F, module.exports.S = _sym;
var x = require("./lateBoundAssignmentDeclarationSupport5.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
