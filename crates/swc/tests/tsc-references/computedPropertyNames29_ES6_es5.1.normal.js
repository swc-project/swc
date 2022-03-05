import * as swcHelpers from "@swc/helpers";
var C = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "bar",
            value: function bar() {
                var _this = this;
                (function() {
                    var obj = swcHelpers.defineProperty({}, _this.bar(), function() {} // needs capture
                    );
                });
                return 0;
            }
        }
    ]);
    return C;
}();
