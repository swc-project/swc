import * as swcHelpers from "@swc/helpers";
// @target: es6
function foo() {
    return '';
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, null, [
        {
            key: "bar",
            value: function bar() {
                var obj = swcHelpers.defineProperty({}, foo(), function() {});
                return 0;
            }
        }
    ]);
    return C;
}();
