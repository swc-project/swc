//// [lateBoundAssignmentDeclarationSupport1.js]
const _sym = Symbol(), _str = "my-fake-sym";
exports[_sym] = "ok", exports["my-fake-sym"] = "ok", exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport1.js"), y = x["my-fake-sym"], z = x[x.S];
