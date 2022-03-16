import * as swcHelpers from "@swc/helpers";
var tmp = swcHelpers.defineProperty({}, this.bar(), 1)[0];
// @target: es5
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    _proto[tmp] = function() {};
    return C;
}();
