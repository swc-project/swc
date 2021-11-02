var _sym = Symbol();
function F() {
}
F[_sym] = "ok", F["my-fake-sym"] = "ok", module.exports.F = F, module.exports.S = _sym;
var x = require("./lateBoundAssignmentDeclarationSupport7.js");
x.F["my-fake-sym"], x.F[x.S];
