//// [typeParameterUsedAsTypeParameterConstraint4.ts]
// Type parameters are in scope in their own and other type parameter lists
// Some negative cases
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
var f3 = function(x, y) {
    var bar = function bar(r, s) {
        var g = function(a, b) {
            x = y;
            return y;
        };
    };
};
var f4 = function(x, y) {
    var bar = function bar() {
        var g = function(a, b) {
            x = y;
            return y;
        };
    };
};
