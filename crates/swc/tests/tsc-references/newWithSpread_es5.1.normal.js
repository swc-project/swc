function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i1 = 0, arr2 = new Array(len); i1 < len; i1++)arr2[i1] = arr[i1];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function _construct(Parent, args, Class) {
            var a1 = [
                null
            ];
            a1.push.apply(a1, args);
            var Constructor = Function.bind.apply(Parent, a1);
            var instance = new Constructor();
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
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
    _classCallCheck(this, B);
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
].concat(_toConsumableArray(a)));
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Multiple spreads arguments
_construct(f2, _toConsumableArray(a).concat(_toConsumableArray(a)));
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a), _toConsumableArray(a)));
// Call expression
new f(1, 2, "string")();
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a)))();
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]))();
// Property access expression
new b.f(1, 2, "string");
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Parenthesised expression
new b.f(1, 2, "string");
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Element access expression
new d[1].f(1, 2, "string");
_construct(d[1].f, [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(d[1].f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Element access expression with a punctuated key
new e["a-b"].f(1, 2, "string");
_construct(e["a-b"].f, [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(e["a-b"].f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Basic expression
new B(1, 2, "string");
_construct(B, [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(B, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Property access expression
new c["a-b"](1, 2, "string");
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Parenthesised expression
new c["a-b"](1, 2, "string");
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Element access expression
new g[1]["a-b"](1, 2, "string");
_construct(g[1]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(g[1]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Element access expression with a punctuated key
new h["a-b"]["a-b"](1, 2, "string");
_construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
// Element access expression with a number
new i["a-b"][1](1, 2, "string");
_construct(i["a-b"][1], [
    1,
    2
].concat(_toConsumableArray(a)));
_construct(i["a-b"][1], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
