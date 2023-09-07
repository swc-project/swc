//// [scopeResolutionIdentifiers.ts]
// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
var M1, M2, M3, s, M4;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Object.defineProperty(M1 || (M1 = {}), "s", {
    enumerable: !0,
    get: function() {
        return s;
    },
    set: function(v) {
        s = v;
    }
}), M2 || (M2 = {}), M3 || (M3 = {}), M4 || (M4 = {});
