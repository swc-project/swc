//// [lateBoundAssignmentDeclarationSupport7.js]
const _sym = Symbol(), _str = "my-fake-sym";
function F() {}
F[_sym] = "ok", F["my-fake-sym"] = "ok", module.exports.F = F, module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport7.js"), y = x.F["my-fake-sym"], z = x.F[x.S];
