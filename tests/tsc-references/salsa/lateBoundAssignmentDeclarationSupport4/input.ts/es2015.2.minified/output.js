const _sym = Symbol();
function F() {
}
F.prototype[_sym] = "ok", F.prototype["my-fake-sym"] = "ok";
const inst = new F();
inst["my-fake-sym"], inst[_sym], module.exports.F = F, module.exports.S = _sym;
const x = require("./lateBoundAssignmentDeclarationSupport4.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
