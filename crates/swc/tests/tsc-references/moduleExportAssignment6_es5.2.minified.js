import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C(x) {
        swcHelpers.classCallCheck(this, C), this.x = x, this.exports = [
            x
        ];
    }
    return swcHelpers.createClass(C, [
        {
            key: "m",
            value: function(y) {
                return this.x + y;
            }
        }
    ]), C;
}();
