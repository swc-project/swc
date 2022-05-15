import * as swcHelpers from "@swc/helpers";
function f(x, y) {
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
function f2() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}
var a, b, c, d, e, g, h, i, B = function(x, y) {
    "use strict";
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
    swcHelpers.classCallCheck(this, B);
};
new f(1, 2, "string"), swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), swcHelpers.construct(f2, swcHelpers.toConsumableArray(a).concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), swcHelpers.toConsumableArray(a))), new f(1, 2, "string")(), swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)))(), swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]))(), new b.f(1, 2, "string"), swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new b.f(1, 2, "string"), swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new d[1].f(1, 2, "string"), swcHelpers.construct(d[1].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(d[1].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new e["a-b"].f(1, 2, "string"), swcHelpers.construct(e["a-b"].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(e["a-b"].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new B(1, 2, "string"), swcHelpers.construct(B, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(B, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new c["a-b"](1, 2, "string"), swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new c["a-b"](1, 2, "string"), swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new g[1]["a-b"](1, 2, "string"), swcHelpers.construct(g[1]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(g[1]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new h["a-b"]["a-b"](1, 2, "string"), swcHelpers.construct(h["a-b"]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(h["a-b"]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
])), new i["a-b"][1](1, 2, "string"), swcHelpers.construct(i["a-b"][1], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a))), swcHelpers.construct(i["a-b"][1], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
