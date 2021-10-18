// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @target: es6
// @filename: lateBoundAssignmentDeclarationSupport6.js
// currently unsupported
var _sym = Symbol();
var _str = "my-fake-sym";
function F() {
}
F.prototype.defsAClass = true;
Object.defineProperty(F.prototype, _str, {
    value: "ok"
});
Object.defineProperty(F.prototype, _sym, {
    value: "ok"
});
var inst = new F();
var _y = inst[_str];
var _z = inst[_sym];
module.exports.F = F;
module.exports.S = _sym;
// @filename: usage.js
var x = require("./lateBoundAssignmentDeclarationSupport6.js");
var inst = new x.F();
var y = inst["my-fake-sym"];
var z = inst[x.S];
