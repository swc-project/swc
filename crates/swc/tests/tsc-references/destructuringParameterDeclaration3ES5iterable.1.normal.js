//// [destructuringParameterDeclaration3ES5iterable.ts]
// If the parameter is a rest parameter, the parameter type is any[]
// A type annotation for a rest parameter must denote an array type.
// RestParameter:
//     ...   Identifier   TypeAnnotation(opt)
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_array } from "@swc/helpers/_/_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
function a1() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
}
function a2() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
function a3() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
function a4() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
function a5() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
function a9(param) {
    var _param = _sliced_to_array(param, 3), a = _param[0], b = _param[1], _param_ = _sliced_to_array(_param[2], 1), _param__ = _sliced_to_array(_param_[0], 1), c = _param__[0];
}
function a10(param) {
    var _param = _to_array(param), a = _param[0], b = _param[1], _param_ = _sliced_to_array(_param[2], 1), _param__ = _sliced_to_array(_param_[0], 1), c = _param__[0], x = _param.slice(3);
}
function a11(param) {
    var _param = _to_array(param), a = _param[0], b = _param[1], c = _param[2], x = _param.slice(3);
}
var array = [
    1,
    2,
    3
];
var array2 = [
    true,
    false,
    "hello"
];
a2(_to_consumable_array(array));
a1.apply(void 0, _to_consumable_array(array));
a9([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    false,
    true
]); // Parameter type is [any, any, [[any]]]
a10([
    1,
    2,
    [
        [
            "string"
        ]
    ],
    false,
    true
]); // Parameter type is any[]
a10([
    1,
    2,
    3,
    false,
    true
]); // Parameter type is any[]
a10([
    1,
    2
]); // Parameter type is any[]
a11([
    1,
    2
]); // Parameter type is number[]
// Rest parameter with generic
function foo() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
foo("hello", 1, 2);
foo("hello", "world");
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    return E;
}(E || {});
;
function foo1() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
foo1(1, 2, 3, 0);
foo1(1, 2, 3, 0, 1);
