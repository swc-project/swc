import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x, y) {};
    _proto.bar = function bar(x, y) {};
    _proto.baz = function baz(x, y) {};
    C.foo = function foo(x, y) {};
    C.bar = function bar(x, y) {};
    C.baz = function baz(x, y) {};
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    _proto.foo = function foo(x, y) {};
    _proto.bar = function bar(x, y) {};
    _proto.baz = function baz(x, y) {};
    D.foo = function foo(x, y) {};
    D.bar = function bar(x, y) {};
    D.baz = function baz(x, y) {};
    return D;
}();
var c;
var r = c.foo(1); // error
var d;
var r2 = d.foo(2); // error
