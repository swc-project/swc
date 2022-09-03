//// [lateBoundAssignmentDeclarationSupport3.js]
const _sym = Symbol(), _str = "my-fake-sym";
Object.defineProperty(module.exports, _sym, {
    value: "ok"
}), Object.defineProperty(module.exports, "my-fake-sym", {
    value: "ok"
}), module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport3.js"), y = x["my-fake-sym"], z = x[x.S];
