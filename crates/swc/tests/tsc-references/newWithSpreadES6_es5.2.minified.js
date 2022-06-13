import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _construct from "@swc/helpers/src/_construct.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function f(x, y) {
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
var a, b, c, d, e, g, h, i, B = function(x, y) {
    "use strict";
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
    _class_call_check(this, B);
};
new f(1, 2, "string"), _construct(f, [
    1,
    2
].concat(_to_consumable_array(a))), _construct(f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), _construct(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}, _to_consumable_array(a).concat(_to_consumable_array(a))), _construct(f, [
    1,
    2
].concat(_to_consumable_array(a), _to_consumable_array(a))), new f(1, 2, "string")(), _construct(f, [
    1,
    2
].concat(_to_consumable_array(a)))(), _construct(f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]))(), new b.f(1, 2, "string"), _construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a))), _construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new b.f(1, 2, "string"), _construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a))), _construct(b.f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new d[1].f(1, 2, "string"), _construct(d[1].f, [
    1,
    2
].concat(_to_consumable_array(a))), _construct(d[1].f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new e["a-b"].f(1, 2, "string"), _construct(e["a-b"].f, [
    1,
    2
].concat(_to_consumable_array(a))), _construct(e["a-b"].f, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new B(1, 2, "string"), _construct(B, [
    1,
    2
].concat(_to_consumable_array(a))), _construct(B, [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new c["a-b"](1, 2, "string"), _construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a))), _construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new c["a-b"](1, 2, "string"), _construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a))), _construct(c["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new g[1]["a-b"](1, 2, "string"), _construct(g[1]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a))), _construct(g[1]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new h["a-b"]["a-b"](1, 2, "string"), _construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a))), _construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
])), new i["a-b"][1](1, 2, "string"), _construct(i["a-b"][1], [
    1,
    2
].concat(_to_consumable_array(a))), _construct(i["a-b"][1], [
    1,
    2
].concat(_to_consumable_array(a), [
    "string"
]));
