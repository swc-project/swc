import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function(x) {}
        }
    ]), C;
}();
swcHelpers.defineProperty({
    foo: function(x) {}
}, "foo", function(x) {});
