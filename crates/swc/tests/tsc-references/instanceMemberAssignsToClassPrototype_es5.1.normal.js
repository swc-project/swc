import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {
                C.prototype.foo = function() {};
            }
        },
        {
            key: "bar",
            value: function bar(x1) {
                C.prototype.bar = function() {} // error
                ;
                C.prototype.bar = function(x) {
                    return x;
                }; // ok
                C.prototype.bar = function(x) {
                    return 1;
                }; // ok
                return 1;
            }
        }
    ]);
    return C;
}();
