import * as swcHelpers from "@swc/helpers";
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
    var _param = swcHelpers.slicedToArray(param, 3), a = _param[0], b = _param[1], ref = swcHelpers.slicedToArray(_param[2], 1), ref1 = swcHelpers.slicedToArray(ref[0], 1), c = ref1[0];
}
function a10(param) {
    var _param = swcHelpers.toArray(param), a = _param[0], b = _param[1], ref = swcHelpers.slicedToArray(_param[2], 1), ref2 = swcHelpers.slicedToArray(ref[0], 1), c = ref2[0], x = _param.slice(3);
}
function a11(param) {
    var _param = swcHelpers.toArray(param), a = _param[0], b = _param[1], c = _param[2], x = _param.slice(3);
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
a2(swcHelpers.toConsumableArray(array));
a1.apply(void 0, swcHelpers.toConsumableArray(array));
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
var E;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
})(E || (E = {}));
var E1;
(function(E1) {
    E1[E1["a"] = 0] = "a";
    E1[E1["b"] = 1] = "b";
})(E1 || (E1 = {}));
function foo1() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
foo1(1, 2, 3, E.a);
foo1(1, 2, 3, 0, E.b);
