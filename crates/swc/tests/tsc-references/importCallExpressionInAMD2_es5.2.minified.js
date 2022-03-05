import * as swcHelpers from "@swc/helpers";
export var B = function() {
    "use strict";
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return swcHelpers.createClass(B, [
        {
            key: "print",
            value: function() {
                return "I am B";
            }
        }
    ]), B;
}();
!function(x) {
    x.then(function(value) {
        new value.B().print();
    });
}(import("./0"));
