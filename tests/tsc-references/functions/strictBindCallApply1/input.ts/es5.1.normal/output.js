function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo(a, b) {
                return "";
            }
        },
        {
            key: "overloaded",
            value: function overloaded(x) {
                return undefined;
            }
        },
        {
            key: "generic",
            value: function generic(x) {
                return x;
            }
        }
    ]);
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
