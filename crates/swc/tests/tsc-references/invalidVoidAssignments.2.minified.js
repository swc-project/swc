//// [invalidVoidAssignments.ts]
var x, M, E, M1, x1, E1;
import "@swc/helpers/_/_class_call_check";
M1 = M || (M = {}), x1 = 1, Object.defineProperty(M1, "x", {
    enumerable: !0,
    get: function() {
        return x1;
    },
    set: function(v) {
        x1 = v;
    }
}), M = x, (E1 = E || (E = {}))[E1.A = 0] = "A";
