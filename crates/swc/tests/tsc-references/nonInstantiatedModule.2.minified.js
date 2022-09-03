//// [nonInstantiatedModule.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(M || (M = {})).a = 1;
var M, m, a1, a2, M2, p, p2, M3, m = M, a1 = M.a, a2 = m.a;
!function(M2) {
    (M2.Point || (M2.Point = {})).Origin = function() {
        return {
            x: 0,
            y: 0
        };
    };
}(M2 || (M2 = {})), function(M3) {
    var Utils = function Utils() {
        "use strict";
        _class_call_check(this, Utils);
    };
    M3.Utils = Utils;
}(M3 || (M3 = {}));
