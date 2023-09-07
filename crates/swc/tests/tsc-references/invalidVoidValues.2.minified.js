//// [invalidVoidValues.ts]
var E, M, E1, M1, x;
import "@swc/helpers/_/_class_call_check";
(E1 = E || (E = {}))[E1.A = 0] = "A", M1 = M || (M = {}), x = 1, Object.defineProperty(M1, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
});
