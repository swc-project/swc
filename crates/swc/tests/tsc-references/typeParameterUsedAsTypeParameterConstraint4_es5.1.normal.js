import * as swcHelpers from "@swc/helpers";
var C = // Type parameters are in scope in their own and other type parameter lists
// Some negative cases
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {
        var r;
        return x;
    };
    return C;
}();
function foo(x, y) {
    var bar = function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    };
}
function foo2(x, y) {
    var bar = function bar() {
        function baz(a, b) {
            x = y;
            return y;
        }
    };
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
