import * as swcHelpers from "@swc/helpers";
// @target: es6
function foo() {
    return '';
}
var tmp = foo();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "bar",
            value: function bar() {
                return 0;
            }
        },
        {
            key: tmp,
            value: function value() {}
        }
    ]);
    return C;
}();
