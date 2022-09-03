//// [strictBindCallApply1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var f00 = foo.bind(void 0), f01 = foo.bind(void 0, 10), f02 = foo.bind(void 0, 10, "hello"), f03 = foo.bind(void 0, 10, 20), f04 = overloaded.bind(void 0), f05 = generic.bind(void 0), c00 = foo.call(void 0, 10, "hello"), c01 = foo.call(void 0, 10), c02 = foo.call(void 0, 10, 20), c03 = foo.call(void 0, 10, "hello", 30), a00 = foo.apply(void 0, [
    10,
    "hello"
]), a01 = foo.apply(void 0, [
    10
]), a02 = foo.apply(void 0, [
    10,
    20
]), a03 = foo.apply(void 0, [
    10,
    "hello",
    30
]), C = function() {
    "use strict";
    function C(a, b) {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function(a, b) {
        return "";
    }, _proto.overloaded = function(x) {}, _proto.generic = function(x) {
        return x;
    }, C;
}(), f10 = c.foo.bind(c), f11 = c.foo.bind(c, 10), f12 = c.foo.bind(c, 10, "hello"), f13 = c.foo.bind(c, 10, 20), f14 = c.foo.bind(void 0), f15 = c.overloaded.bind(c), f16 = c.generic.bind(c), c10 = c.foo.call(c, 10, "hello"), c11 = c.foo.call(c, 10), c12 = c.foo.call(c, 10, 20), c13 = c.foo.call(c, 10, "hello", 30), c14 = c.foo.call(void 0, 10, "hello"), a10 = c.foo.apply(c, [
    10,
    "hello"
]), a11 = c.foo.apply(c, [
    10
]), a12 = c.foo.apply(c, [
    10,
    20
]), a13 = c.foo.apply(c, [
    10,
    "hello",
    30
]), a14 = c.foo.apply(void 0, [
    10,
    "hello"
]), f20 = C.bind(void 0), f21 = C.bind(void 0, 10), f22 = C.bind(void 0, 10, "hello"), f23 = C.bind(void 0, 10, 20);
function bar(callback) {
    callback.bind(1), callback.bind(2);
}
function baz(callback) {
    callback.bind(1), callback.bind(2);
}
C.call(c, 10, "hello"), C.call(c, 10), C.call(c, 10, 20), C.call(c, 10, "hello", 30), C.apply(c, [
    10,
    "hello"
]), C.apply(c, [
    10
]), C.apply(c, [
    10,
    20
]), C.apply(c, [
    10,
    "hello",
    30
]);
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo), this.fn.bind(this);
    }
    return Foo.prototype.fn = function() {
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    }, Foo;
}(), Bar = function() {
    "use strict";
    function Bar() {
        _class_call_check(this, Bar), this.fn.bind(this);
    }
    return Bar.prototype.fn = function() {
        for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    }, Bar;
}();
