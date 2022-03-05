import * as swcHelpers from "@swc/helpers";
var c, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "x",
            get: function() {
                return function(x) {
                    return "";
                };
            },
            set: function(v) {}
        }
    ]), C;
}();
c.x("");
