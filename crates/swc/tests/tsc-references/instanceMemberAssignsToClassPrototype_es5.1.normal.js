import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        C.prototype.foo = function() {};
    };
    _proto.bar = function bar(x) {
        C.prototype.bar = function() {} // error
        ;
        C.prototype.bar = function(x) {
            return x;
        }; // ok
        C.prototype.bar = function(x) {
            return 1;
        }; // ok
        return 1;
    };
    return C;
}();
