import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.bar = function() {
        return swcHelpers.defineProperty({}, this.bar(), function() {}), 0;
    }, C;
}();
