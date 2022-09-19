//// [typesWithSpecializedCallSignatures.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var i, a, c = new (function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}())();
c = i, i = c = a, i = a, a = c, a = i, c.foo("hi"), c.foo("bye"), c.foo("hm");
