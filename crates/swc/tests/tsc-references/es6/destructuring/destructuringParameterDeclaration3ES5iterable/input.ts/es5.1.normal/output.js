function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
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
    var _param = _slicedToArray(param, 3), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref1 = _slicedToArray(ref[0], 1), c = ref1[0];
}
function a10(param) {
    var _param = _toArray(param), a = _param[0], b = _param[1], ref = _slicedToArray(_param[2], 1), ref2 = _slicedToArray(ref[0], 1), c = ref2[0], x = _param.slice(3);
}
function a11(param) {
    var _param = _toArray(param), a = _param[0], b = _param[1], c = _param[2], x = _param.slice(3);
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
a2(_toConsumableArray(array));
a1.apply(void 0, _toConsumableArray(array));
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
var E2;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
})(E2 || (E2 = {
}));
var E11;
(function(E1) {
    E1[E1["a"] = 0] = "a";
    E1[E1["b"] = 1] = "b";
})(E11 || (E11 = {
}));
function foo1() {
    for(var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++){
        a[_key] = arguments[_key];
    }
}
foo1(1, 2, 3, E2.a);
foo1(1, 2, 3, E11.a, E2.b);
