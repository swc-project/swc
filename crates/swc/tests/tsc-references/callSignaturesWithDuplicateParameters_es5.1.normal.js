import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// Duplicate parameter names are always an error
function foo(x, x) {}
var f = function foo(x, x) {};
var f2 = function f2(x, x) {};
var f3 = function(x, x) {};
var f4 = function(x, x) {};
function foo2(x, x) {}
var f5 = function foo(x, x) {};
var f6 = function f6(x, x) {};
var f7 = function(x, x) {};
var f8 = function(x, y) {};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x, x) {};
    _proto.foo2 = function foo2(x, x) {};
    _proto.foo3 = function foo3(x, x) {};
    return C;
}();
var a;
var b = {
    foo: function foo(x, x) {},
    a: function foo(x, x) {},
    b: function(x, x) {}
};
