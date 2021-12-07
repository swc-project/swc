function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i1 = 0, arr2 = new Array(len); i1 < len; i1++)arr2[i1] = arr[i1];
    return arr2;
}
function _construct(Parent, args, Class) {
    return (_construct = !function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
            })), !0;
        } catch (e) {
            return !1;
        }
    }() ? function _construct(Parent, args, Class) {
        var a1 = [
            null
        ];
        a1.push.apply(a1, args);
        var Constructor = Function.bind.apply(Parent, a1), instance = new Constructor();
        return Class && _setPrototypeOf(instance, Class.prototype), instance;
    } : Reflect.construct).apply(null, arguments);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _toConsumableArray(arr) {
    return (function(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    })(arr) || (function(iter) {
        if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
    })(arr) || _unsupportedIterableToArray(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
}
function _unsupportedIterableToArray(o, minLen) {
    if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
        if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
}
function f(x, y) {
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
}
var a, b, c, d, e, g, h, i, B = function(x, y) {
    "use strict";
    for(var _len = arguments.length, z = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)z[_key - 2] = arguments[_key];
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, B);
};
new f(1, 2, "string"), _construct(f, [
    1,
    2
].concat(_toConsumableArray(a))), _construct(f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), _construct(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
}, _toConsumableArray(a).concat(_toConsumableArray(a))), _construct(f, [
    1,
    2
].concat(_toConsumableArray(a), _toConsumableArray(a))), new f(1, 2, "string")(), _construct(f, [
    1,
    2
].concat(_toConsumableArray(a)))(), _construct(f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]))(), new b.f(1, 2, "string"), _construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a))), _construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new b.f(1, 2, "string"), _construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a))), _construct(b.f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new d[1].f(1, 2, "string"), _construct(d[1].f, [
    1,
    2
].concat(_toConsumableArray(a))), _construct(d[1].f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new e["a-b"].f(1, 2, "string"), _construct(e["a-b"].f, [
    1,
    2
].concat(_toConsumableArray(a))), _construct(e["a-b"].f, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new B(1, 2, "string"), _construct(B, [
    1,
    2
].concat(_toConsumableArray(a))), _construct(B, [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new c["a-b"](1, 2, "string"), _construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a))), _construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new c["a-b"](1, 2, "string"), _construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a))), _construct(c["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new g[1]["a-b"](1, 2, "string"), _construct(g[1]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a))), _construct(g[1]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new h["a-b"]["a-b"](1, 2, "string"), _construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a))), _construct(h["a-b"]["a-b"], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
])), new i["a-b"][1](1, 2, "string"), _construct(i["a-b"][1], [
    1,
    2
].concat(_toConsumableArray(a))), _construct(i["a-b"][1], [
    1,
    2
].concat(_toConsumableArray(a), [
    "string"
]));
