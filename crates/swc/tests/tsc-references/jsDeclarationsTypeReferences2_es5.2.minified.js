export var o = {
    a: 1,
    m: 1
};
var _o = require("./something").o, a = _o.a, m = _o.m;
module.exports = {
    thing: a + m
};
