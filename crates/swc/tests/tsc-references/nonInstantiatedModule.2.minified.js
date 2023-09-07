//// [nonInstantiatedModule.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
M = M1 || (M1 = {}), a = 1, Object.defineProperty(M, "a", {
    enumerable: !0,
    get: function() {
        return a;
    },
    set: function(v) {
        a = v;
    }
});
var M2, M, a, M1, M21, M3, m = M1;
M1.a, m.a, ((M2 = M21 || (M21 = {})).Point || (M2.Point = {})).Origin = function() {
    return {
        x: 0,
        y: 0
    };
}, (M3 || (M3 = {})).Utils = function Utils() {
    _class_call_check(this, Utils);
};
