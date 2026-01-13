//// [destructuringParameterDeclaration3ES5iterable.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function a10(param) {
    var _param = _to_array(param), _param_ = (_param[0], _param[1], _sliced_to_array(_param[2], 1));
    _sliced_to_array(_param_[0], 1)[0], _param.slice(3);
}
var _param, _param_, _param1, E, array = [
    1,
    2,
    3
];
function foo() {
    for(var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}
!function() {
    for(var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}(_to_consumable_array(array)), (function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}).apply(void 0, _to_consumable_array(array)), (_param = _sliced_to_array([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    !1,
    !0
], 3))[0], _param[1], _param_ = _sliced_to_array(_param[2], 1), _sliced_to_array(_param_[0], 1)[0], a10([
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
]), (_param1 = _to_array([
    1,
    2
]))[0], _param1[1], _param1[2], _param1.slice(3), foo("hello", 1, 2), foo("hello", "world");
var E1 = ((E = E1 || {})[E.a = 0] = "a", E[E.b = 1] = "b", E);
function foo1() {
    for(var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++)a[_key] = arguments[_key];
}
foo1(1, 2, 3, 0), foo1(1, 2, 3, 0, 1);
