import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C(x) {
        swcHelpers.classCallCheck(this, C), this.x = x, this.exports = [
            x
        ];
    }
    return C.prototype.m = function(y) {
        return this.x + y;
    }, C;
}();
