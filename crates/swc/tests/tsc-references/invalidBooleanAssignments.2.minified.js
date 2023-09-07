//// [invalidBooleanAssignments.ts]
var E, M, E1, M1, a;
import "@swc/helpers/_/_class_call_check";
(E1 = E || (E = {}))[E1.A = 0] = "A", M1 = M || (M = {}), a = 1, Object.defineProperty(M1, "a", {
    enumerable: !0,
    get: function() {
        return a;
    },
    set: function(v) {
        a = v;
    }
});
