//// [lateBoundAssignmentDeclarationSupport2.js]
const _sym = Symbol();
module.exports[_sym] = "ok", module.exports["my-fake-sym"] = "ok", module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport2.js");
x["my-fake-sym"], x[x.S];
