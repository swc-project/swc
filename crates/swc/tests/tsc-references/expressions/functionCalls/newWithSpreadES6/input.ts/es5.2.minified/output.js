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
        if (Array.isArray(arr)) {
            for(var i1 = 0, arr2 = new Array(arr.length); i1 < arr.length; i1++)arr2[i1] = arr[i1];
            return arr2;
        }
    })(arr) || (function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    })(arr) || (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    })();
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
