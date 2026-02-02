//// [typeParameterUsedAsTypeParameterConstraint4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// Type parameters are in scope in their own and other type parameter lists
// Some negative cases
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {
        var r;
        return x;
    };
    return C;
}();
function foo(x, y) {
    function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    }
}
function foo2(x, y) {
    function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    }
}
var f3 = function f3(x, y) {
    var bar = function bar(r, s) {
        var g = function g(a, b) {
            x = y;
            return y;
        };
    };
};
var f4 = function f4(x, y) {
    var bar = function bar() {
        var g = function g(a, b) {
            x = y;
            return y;
        };
    };
};
