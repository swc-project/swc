//// [lateBoundAssignmentDeclarationSupport3.js]
const _sym = Symbol();
Object.defineProperty(module.exports, _sym, {
    value: "ok"
}), Object.defineProperty(module.exports, "my-fake-sym", {
    value: "ok"
}), module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport3.js");
x["my-fake-sym"], x[x.S];
