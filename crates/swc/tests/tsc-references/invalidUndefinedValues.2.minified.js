//// [invalidUndefinedValues.ts]
var M, E, M1, x, E1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
M1 = M || (M = {}), x = 1, Object.defineProperty(M1, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
}), (E1 = E || (E = {}))[E1.A = 0] = "A";
