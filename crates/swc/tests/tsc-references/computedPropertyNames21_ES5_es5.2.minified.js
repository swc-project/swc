import * as swcHelpers from "@swc/helpers";
var tmp = this.bar(), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "bar",
            value: function() {
                return 0;
            }
        },
        {
            key: tmp,
            value: function() {}
        }
    ]), C;
}();
