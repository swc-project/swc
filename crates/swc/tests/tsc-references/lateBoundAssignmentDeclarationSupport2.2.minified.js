//// [lateBoundAssignmentDeclarationSupport2.js]
const _sym = Symbol(), _str = "my-fake-sym";
module.exports[_sym] = "ok", module.exports["my-fake-sym"] = "ok", module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport2.js"), y = x["my-fake-sym"], z = x[x.S];
