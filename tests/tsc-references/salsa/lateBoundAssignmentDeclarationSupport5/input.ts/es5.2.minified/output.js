function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
var _obj, _sym = Symbol();
function F() {
}
F.prototype = (_defineProperty(_obj = {
}, _sym, "ok"), _defineProperty(_obj, "my-fake-sym", "ok"), _obj);
var inst = new F();
inst["my-fake-sym"], inst[_sym], module.exports.F = F, module.exports.S = _sym;
var x = require("./lateBoundAssignmentDeclarationSupport5.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
