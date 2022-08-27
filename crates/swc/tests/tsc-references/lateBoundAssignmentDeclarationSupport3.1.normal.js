//// [lateBoundAssignmentDeclarationSupport3.js]
// currently unsupported
const _sym = Symbol();
const _str = "my-fake-sym";
Object.defineProperty(module.exports, _sym, {
    value: "ok"
});
Object.defineProperty(module.exports, _str, {
    value: "ok"
});
module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport3.js");
const y = x["my-fake-sym"];
const z = x[x.S];
