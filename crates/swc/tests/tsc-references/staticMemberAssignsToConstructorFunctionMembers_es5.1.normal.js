import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, null, [
        {
            key: "foo",
            value: function foo() {
                C.foo = function() {};
            }
        },
        {
            key: "bar",
            value: function bar(x1) {
                C.bar = function() {} // error
                ;
                C.bar = function(x) {
                    return x;
                }; // ok
                C.bar = function(x) {
                    return 1;
                }; // ok
                return 1;
            }
        }
    ]);
    return C;
}();
