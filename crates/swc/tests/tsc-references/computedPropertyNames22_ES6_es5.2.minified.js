import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "bar",
            value: function() {
                return swcHelpers.defineProperty({}, this.bar(), function() {}), 0;
            }
        }
    ]), C;
}();
