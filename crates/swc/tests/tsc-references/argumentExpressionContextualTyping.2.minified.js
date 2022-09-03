//// [argumentExpressionContextualTyping.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function foo(param) {
    var _x = _sliced_to_array(param.x, 2), _y = (_x[0], _x[1], param.y);
    _y.c, _y.d, _y.e;
}
function bar(param) {
    var _x = _sliced_to_array(param.x, 2), _y = (_x[0], _x[1], param.y);
    _y.c, _y.d, _y.e;
}
function baz(x) {}
var o = {
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
}, o1 = {
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
};
foo(o1), foo({
    x: [
        "string",
        1
    ],
    y: {
        c: !0,
        d: "world",
        e: 3
    }
});
var array = [
    "string",
    1,
    !0
], tuple = [
    "string",
    1,
    !0
];
baz(tuple), baz([
    "string",
    1,
    !0
]), baz(array), baz([
    "string",
    1,
    !0
].concat(_to_consumable_array(array))), foo(o);
