var _sym = Symbol();
function F() {
}
F.prototype[_sym] = "ok", F.prototype["my-fake-sym"] = "ok";
var inst = new F();
inst["my-fake-sym"], inst[_sym], module.exports.F = F, module.exports.S = _sym;
var x = require("./lateBoundAssignmentDeclarationSupport4.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
