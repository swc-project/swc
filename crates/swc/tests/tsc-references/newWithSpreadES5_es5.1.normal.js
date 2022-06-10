import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _construct from "@swc/helpers/lib/_construct.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
//@target: ES5
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
    _class_call_check(this, B);
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
_construct(f, [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Multiple spreads arguments
_construct(f2, _to_consumable_array(a).concat(_to_consumable_array(a)));
_construct(f, [
    1,
    2
].concat(_to_consumable_array(a), _to_consumable_array(a)));
// Call expression
new f(1, 2, "string")();
_construct(f, [
    1,
    2
].concat(_to_consumable_array(a)))();
_construct(f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]))();
// Property access expression
new b.f(1, 2, "string");
_construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Parenthesised expression
new b.f(1, 2, "string");
_construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Element access expression
new d[1].f(1, 2, "string");
_construct(d[1].f, [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(d[1].f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Element access expression with a punctuated key
new e["a-b"].f(1, 2, "string");
_construct(e["a-b"].f, [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(e["a-b"].f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Basic expression
new B(1, 2, "string");
_construct(B, [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(B, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Property access expression
new c["a-b"](1, 2, "string");
_construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Parenthesised expression
new c["a-b"](1, 2, "string");
_construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Element access expression
new g[1]["a-b"](1, 2, "string");
_construct(g[1]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(g[1]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Element access expression with a punctuated key
new h["a-b"]["a-b"](1, 2, "string");
_construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
// Element access expression with a number
new i["a-b"][1](1, 2, "string");
_construct(i["a-b"][1], [
    1,
    2
].concat(_to_consumable_array(a)));
_construct(i["a-b"][1], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
