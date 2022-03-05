import * as swcHelpers from "@swc/helpers";
//@target: ES6
function f(x, y) {
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        z[_key - 2] = arguments[_key];
    }
}
function f2() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
}
var B = function B(x, y) {
    "use strict";
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        z[_key - 2] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, B);
};
var a;
var b;
var c;
var d;
var e;
var g;
var h;
var i;
// Basic expression
new f(1, 2, "string");
swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Multiple spreads arguments
swcHelpers.construct(f2, swcHelpers.toConsumableArray(a).concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), swcHelpers.toConsumableArray(a)));
// Call expression
new f(1, 2, "string")();
swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)))();
swcHelpers.construct(f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]))();
// Property access expression
new b.f(1, 2, "string");
swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Parenthesised expression
new b.f(1, 2, "string");
swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(b.f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Element access expression
new d[1].f(1, 2, "string");
swcHelpers.construct(d[1].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(d[1].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Element access expression with a punctuated key
new e["a-b"].f(1, 2, "string");
swcHelpers.construct(e["a-b"].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(e["a-b"].f, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Basic expression
new B(1, 2, "string");
swcHelpers.construct(B, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(B, [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Property access expression
new c["a-b"](1, 2, "string");
swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Parenthesised expression
new c["a-b"](1, 2, "string");
swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(c["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Element access expression
new g[1]["a-b"](1, 2, "string");
swcHelpers.construct(g[1]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(g[1]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Element access expression with a punctuated key
new h["a-b"]["a-b"](1, 2, "string");
swcHelpers.construct(h["a-b"]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(h["a-b"]["a-b"], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
// Element access expression with a number
new i["a-b"][1](1, 2, "string");
swcHelpers.construct(i["a-b"][1], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a)));
swcHelpers.construct(i["a-b"][1], [
    1,
    2
].concat(swcHelpers.toConsumableArray(a), [
    "string"
]));
