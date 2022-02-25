function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
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
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
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
