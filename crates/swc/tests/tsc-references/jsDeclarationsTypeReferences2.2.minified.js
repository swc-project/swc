//// [something.ts]
export var o = {
    a: 1,
    m: 1
};
//// [index.js]
var _o = require("./something").o, a = _o.a, m = _o.m, thing = a + m;
module.exports = {
    thing: thing
};
