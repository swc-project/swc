//// [something.ts]
export var o = {
    a: 1,
    m: 1
};
//// [index.js]
var _require_o = require("./something").o, a = _require_o.a, m = _require_o.m;
module.exports = {
    thing: a + m
};
