//// [lateBoundAssignmentDeclarationSupport5.js]
const _sym = Symbol(), _str = "my-fake-sym";
function F() {}
F.prototype = {
    [_sym]: "ok",
    [_str]: "ok"
};
const inst = new F();
inst[_str], inst[_sym], module.exports.F = F, module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport5.js"), inst = new x.F();
inst["my-fake-sym"], inst[x.S];
