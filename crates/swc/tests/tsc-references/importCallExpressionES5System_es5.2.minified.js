import * as swcHelpers from "@swc/helpers";
export function foo() {
    return "foo";
}
import("./0"), import("./0").then(function(zero) {
    return zero.foo();
});
export var p1, p2 = import("./0");
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.method = function() {
        import("./0");
    }, C;
}();
export var D = function() {
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return D.prototype.method = function() {
        import("./0");
    }, D;
}();
