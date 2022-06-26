import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var f00 = foo.bind(undefined);
var f01 = foo.bind(undefined, 10);
var f02 = foo.bind(undefined, 10, "hello");
var f03 = foo.bind(undefined, 10, 20); // Error
var f04 = overloaded.bind(undefined); // typeof overloaded
var f05 = generic.bind(undefined); // typeof generic
var c00 = foo.call(undefined, 10, "hello");
var c01 = foo.call(undefined, 10); // Error
var c02 = foo.call(undefined, 10, 20); // Error
var c03 = foo.call(undefined, 10, "hello", 30); // Error
var a00 = foo.apply(undefined, [
    10,
    "hello"
]);
var a01 = foo.apply(undefined, [
    10
]); // Error
var a02 = foo.apply(undefined, [
    10,
    20
]); // Error
var a03 = foo.apply(undefined, [
    10,
    "hello",
    30
]); // Error
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(a, b) {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo1(a, b) {
        return "";
    };
    _proto.overloaded = function overloaded1(x) {
        return undefined;
    };
    _proto.generic = function generic1(x) {
        return x;
    };
    return C;
}();
var f10 = c.foo.bind(c);
var f11 = c.foo.bind(c, 10);
var f12 = c.foo.bind(c, 10, "hello");
var f13 = c.foo.bind(c, 10, 20); // Error
var f14 = c.foo.bind(undefined); // Error
var f15 = c.overloaded.bind(c); // typeof C.prototype.overloaded
var f16 = c.generic.bind(c); // typeof C.prototype.generic
var c10 = c.foo.call(c, 10, "hello");
var c11 = c.foo.call(c, 10); // Error
var c12 = c.foo.call(c, 10, 20); // Error
var c13 = c.foo.call(c, 10, "hello", 30); // Error
var c14 = c.foo.call(undefined, 10, "hello"); // Error
var a10 = c.foo.apply(c, [
    10,
    "hello"
]);
var a11 = c.foo.apply(c, [
    10
]); // Error
var a12 = c.foo.apply(c, [
    10,
    20
]); // Error
var a13 = c.foo.apply(c, [
    10,
    "hello",
    30
]); // Error
var a14 = c.foo.apply(undefined, [
    10,
    "hello"
]); // Error
var f20 = C.bind(undefined);
var f21 = C.bind(undefined, 10);
var f22 = C.bind(undefined, 10, "hello");
var f23 = C.bind(undefined, 10, 20); // Error
C.call(c, 10, "hello");
C.call(c, 10); // Error
C.call(c, 10, 20); // Error
C.call(c, 10, "hello", 30); // Error
C.apply(c, [
    10,
    "hello"
]);
C.apply(c, [
    10
]); // Error
C.apply(c, [
    10,
    20
]); // Error
C.apply(c, [
    10,
    "hello",
    30
]); // Error
