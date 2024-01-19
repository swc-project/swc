//// [something.ts]
export var o = {
    a: 1,
    m: 1
};
//// [index.js]
var _require_o = require("./something").o;
module.exports = {
    thing: _require_o.a + _require_o.m
};
