//// [lateBoundAssignmentDeclarationSupport6.js]
let _sym = Symbol(), _str = "my-fake-sym";
function F() {}
F.prototype.defsAClass = !0, Object.defineProperty(F.prototype, _str, {
    value: "ok"
}), Object.defineProperty(F.prototype, _sym, {
    value: "ok"
});
let inst = new F();
inst[_str], inst[_sym], module.exports.F = F, module.exports.S = _sym;
//// [usage.js]
let x = require("./lateBoundAssignmentDeclarationSupport6.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
