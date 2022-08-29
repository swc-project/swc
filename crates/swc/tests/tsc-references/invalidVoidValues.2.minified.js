//// [invalidVoidValues.ts]
var x, E, a, b, M, M1;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f(a) {
    x = a;
}
x = 1, x = "", x = !0, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), x = E, x = E.A, x = a, x = b, x = {
    f: function() {}
}, M1 = M || (M = {}), M1.x = 1, x = M, x = f;
