//// [wrappedAndRecursiveConstraints4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return function(x) {
            return x;
        };
    }, C;
}(), c = new C({
    length: 2
}), r = c.foo(""), r2 = r({
    length: 3,
    charAt: function(x) {}
});
