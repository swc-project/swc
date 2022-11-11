//// [something.ts]
export var o = {
    a: 1,
    m: 1
};
//// [index.js]
var _require_o = require("./something").o, a = _require_o.a, m = _require_o.m;
var thing = a + m;
module.exports = {
    thing: thing
};
