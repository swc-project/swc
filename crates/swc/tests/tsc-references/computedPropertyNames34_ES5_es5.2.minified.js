import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.bar = function() {
        return swcHelpers.defineProperty({}, "", function() {}), 0;
    }, C;
}();
