//// [invalidUndefinedValues.ts]
var x, a, b, c, M, E;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f(a) {
    x = a;
}
x = 1, x = "", x = !0, x = a, x = null, x = function C() {
    "use strict";
    _class_call_check(this, C);
}, x = b, x = c, (M || (M = {})).x = 1, x = M, x = {
    f: function() {}
}, x = f, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), x = E, x = E.A;
