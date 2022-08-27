//// [lateBoundAssignmentDeclarationSupport1.js]
const _sym = Symbol();
exports[_sym] = "ok", exports["my-fake-sym"] = "ok", exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport1.js");
x["my-fake-sym"], x[x.S];
