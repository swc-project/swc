//// [invalidUndefinedAssignments.ts]
var x, E, M, E1, M1, x1;
import "@swc/helpers/_/_class_call_check";
(E1 = E || (E = {}))[E1.A = 0] = "A", (E = x).A = x, I = x, M1 = M || (M = {}), x1 = 1, Object.defineProperty(M1, "x", {
    enumerable: !0,
    get: function() {
        return x1;
    },
    set: function(v) {
        x1 = v;
    }
});
