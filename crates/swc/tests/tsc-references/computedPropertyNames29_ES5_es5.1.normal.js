import * as swcHelpers from "@swc/helpers";
// @target: es5
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        var _this = this;
        (function() {
            var obj = swcHelpers.defineProperty({}, _this.bar(), function() {} // needs capture
            );
        });
        return 0;
    };
    return C;
}();
