import * as swcHelpers from "@swc/helpers";
// @target: es5
function foo() {
    return '';
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    C.bar = function bar() {
        var obj = swcHelpers.defineProperty({}, foo(), function() {});
        return 0;
    };
    return C;
}();
