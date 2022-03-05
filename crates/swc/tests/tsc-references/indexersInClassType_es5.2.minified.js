import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "fn",
            value: function() {
                return this;
            }
        }
    ]), C;
}(), r = new C().fn();
r[1], r.a;
