function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
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
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
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
    _classCallCheck(this, B);
};
var a1;
var b;
var c;
var d;
var e;
var g;
var h;
var i1;
// Basic expression
new f(1, 2, "string");
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Multiple spreads arguments
_construct(f2, _toConsumableArray(a1).concat(_toConsumableArray(a1)));
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a1), _toConsumableArray(a1)));
// Call expression
new f(1, 2, "string")();
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a1)))();
_construct(f, [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]))();
// Property access expression
new b.f(1, 2, "string");
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Parenthesised expression
new b.f(1, 2, "string");
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Element access expression
new d[1].f(1, 2, "string");
_construct(d[1].f, [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(d[1].f, [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Element access expression with a punctuated key
new e["a-b"].f(1, 2, "string");
_construct(e["a-b"].f, [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(e["a-b"].f, [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Basic expression
new B(1, 2, "string");
_construct(B, [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(B, [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Property access expression
new c["a-b"](1, 2, "string");
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Parenthesised expression
new c["a-b"](1, 2, "string");
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Element access expression
new g[1]["a-b"](1, 2, "string");
_construct(g[1]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(g[1]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Element access expression with a punctuated key
new h["a-b"]["a-b"](1, 2, "string");
_construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
// Element access expression with a number
new i1["a-b"][1](1, 2, "string");
_construct(i1["a-b"][1], [
    1,
    2
].concat(_toConsumableArray(a1)));
_construct(i1["a-b"][1], [
    1,
    2
].concat(_toConsumableArray(a1), [
    "string"
]));
