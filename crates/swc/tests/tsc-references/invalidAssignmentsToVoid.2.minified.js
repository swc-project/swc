//// [invalidAssignmentsToVoid.ts]
var M, M1, x;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
M1 = M || (M = {}), x = 1, Object.defineProperty(M1, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
});
