//// [nonInstantiatedModule.ts]
var M, M2, M3;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(M || (M = {})).a = 1, (void 0).a, (void 0).a, function(M2) {
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
