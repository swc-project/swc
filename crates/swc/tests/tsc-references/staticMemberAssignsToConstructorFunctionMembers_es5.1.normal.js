import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    C.foo = function foo() {
        C.foo = function() {};
    };
    C.bar = function bar(x1) {
        C.bar = function() {} // error
        ;
        C.bar = function(x) {
            return x;
        }; // ok
        C.bar = function(x) {
            return 1;
        }; // ok
        return 1;
    };
    return C;
}();
