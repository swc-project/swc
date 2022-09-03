//// [lateBoundAssignmentDeclarationSupport5.js]
const _sym = Symbol(), _str = "my-fake-sym";
function F() {}
F.prototype = {
    [_sym]: "ok",
    [_str]: "ok"
};
const inst = new F(), _y = inst[_str], _z = inst[_sym];
module.exports.F = F, module.exports.S = _sym;
//// [usage.js]
const x = require("./lateBoundAssignmentDeclarationSupport5.js"), inst = new x.F(), y = inst["my-fake-sym"], z = inst[x.S];
