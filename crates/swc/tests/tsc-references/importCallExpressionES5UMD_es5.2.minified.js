import * as swcHelpers from "@swc/helpers";
export function foo() {
    return "foo";
}
import("./0"), import("./0").then(function(zero) {
    return zero.foo();
});
export var p1, p2 = import("./0");
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "method",
            value: function() {
                import("./0");
            }
        }
    ]), C;
}();
export var D = function() {
    "use strict";
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return swcHelpers.createClass(D, [
        {
            key: "method",
            value: function() {
                import("./0");
            }
        }
    ]), D;
}();
