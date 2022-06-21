import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function a10(param) {
    var _param = _to_array(param), ref = (_param[0], _param[1], _sliced_to_array(_param[2], 1)), ref1 = _sliced_to_array(ref[0], 1);
    ref1[0], _param.slice(3);
}
var E, E1, array = [
    1,
    2,
    3
];
function foo() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}
function foo1() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}
!function() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}(_to_consumable_array(array)), (function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}).apply(void 0, _to_consumable_array(array)), function(param) {
    var _param = _sliced_to_array(param, 3), ref = (_param[0], _param[1], _sliced_to_array(_param[2], 1)), ref1 = _sliced_to_array(ref[0], 1);
    ref1[0];
}([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), a10([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
]), a10([
    1,
    2,
    3,
    !1,
    !0
]), a10([
    1,
    2
]), function(param) {
    var _param = _to_array(param);
    _param[0], _param[1], _param[2], _param.slice(3);
}([
    1,
    2
]), foo("hello", 1, 2), foo("hello", "world"), function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), function(E1) {
    E1[E1.a = 0] = "a", E1[E1.b = 1] = "b";
}(E1 || (E1 = {})), foo1(1, 2, 3, E.a), foo1(1, 2, 3, 0, E.b);
