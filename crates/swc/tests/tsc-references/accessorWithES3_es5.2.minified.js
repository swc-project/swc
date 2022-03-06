import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "x",
            get: function() {
                return 1;
            }
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return swcHelpers.createClass(D, [
        {
            key: "x",
            set: function(v) {}
        }
    ]), D;
}();
