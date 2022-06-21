import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x1;
var x2;
var x3;
function f1(x) {
    var y;
    return this;
}
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    C2.foo = function foo(x) {
        return undefined;
    };
    return C2;
}();
C2.y = undefined;
var N1;
(function(N1) {
    var x;
    var y = N1.y = this;
    N1.x = x;
})(N1 || (N1 = {}));
var C3 = /*#__PURE__*/ function() {
    "use strict";
    function C3() {
        _class_call_check(this, C3);
        this.x1 = {
            g: function g(x) {
                return undefined;
            }
        };
    }
    var _proto = C3.prototype;
    _proto.f = function f() {
        var g = function g(x) {
            return undefined;
        };
        var x2 = {
            h: function h(x) {
                return undefined;
            }
        };
    };
    return C3;
}();
