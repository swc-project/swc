//// [lateBoundAssignmentDeclarationSupport1.js]
// currently unsupported
const _sym = Symbol();
const _str = "my-fake-sym";
exports[_sym] = "ok";
exports[_str] = "ok";
exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport1.js");
const y = x["my-fake-sym"];
const z = x[x.S];
