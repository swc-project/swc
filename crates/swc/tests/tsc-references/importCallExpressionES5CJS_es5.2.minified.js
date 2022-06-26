import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
        _class_call_check(this, C);
    }
    return C.prototype.method = function() {
        import("./0");
    }, C;
}();
export var D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.method = function() {
        import("./0");
    }, D;
}();
