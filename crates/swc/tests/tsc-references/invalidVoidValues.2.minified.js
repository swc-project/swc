//// [invalidVoidValues.ts]
var x, E, M;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f(a) {
    x = a;
}
x = 1, x = "", x = !0, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), x = E, x = E.A, x = void 0, x = void 0, x = {
    f: function() {}
}, (M || (M = {})).x = 1, x = M, x = f;
