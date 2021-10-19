const _sym = Symbol();
function F() {
}
F.prototype.defsAClass = !0, Object.defineProperty(F.prototype, "my-fake-sym", {
    value: "ok"
}), Object.defineProperty(F.prototype, _sym, {
    value: "ok"
});
const inst = new F();
inst["my-fake-sym"], inst[_sym], module.exports.F = F, module.exports.S = _sym;
const x = require("./lateBoundAssignmentDeclarationSupport6.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
