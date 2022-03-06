import * as swcHelpers from "@swc/helpers";
var tmp = this.bar();
var C = // @target: es5
/*#__PURE__*/ function() {
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
