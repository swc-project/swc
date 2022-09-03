//// [wrappedAndRecursiveConstraints.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C(data) {
        _class_call_check(this, C), this.data = data;
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}(), y = null, c = new C(y), r = c.foo(y);
