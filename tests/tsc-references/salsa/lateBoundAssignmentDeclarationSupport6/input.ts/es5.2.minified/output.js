var _sym = Symbol();
function F() {
}
F.prototype.defsAClass = !0, Object.defineProperty(F.prototype, "my-fake-sym", {
    value: "ok"
}), Object.defineProperty(F.prototype, _sym, {
    value: "ok"
});
var inst = new F();
inst["my-fake-sym"], inst[_sym], module.exports.F = F, module.exports.S = _sym;
var x = require("./lateBoundAssignmentDeclarationSupport6.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
