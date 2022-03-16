import * as swcHelpers from "@swc/helpers";
var tmp = swcHelpers.defineProperty({}, this.bar(), 1)[0], C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    return _proto.bar = function() {
        return 0;
    }, _proto[tmp] = function() {}, C;
}();
