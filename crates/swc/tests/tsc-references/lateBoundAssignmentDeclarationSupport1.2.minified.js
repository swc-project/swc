//// [lateBoundAssignmentDeclarationSupport1.js]
let _sym = Symbol();
exports[_sym] = "ok", exports["my-fake-sym"] = "ok", exports.S = _sym;
//// [usage.js]
let x = require("./lateBoundAssignmentDeclarationSupport1.js");
x["my-fake-sym"], x[x.S];
