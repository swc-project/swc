//// [nonInstantiatedModule.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M;
(function(M) {
    var a = M.a = 1;
})(M || (M = {}));
// primary expression
var m;
var m = M;
var a1;
var a1 = M.a;
var a2;
var a2 = m.a;
var M2;
(function(M2) {
    var Point;
    (function(Point) {
        function Origin() {
            return {
                x: 0,
                y: 0
            };
        }
        Point.Origin = Origin;
    })(Point = M2.Point || (M2.Point = {}));
})(M2 || (M2 = {}));
var p;
var p;
var p2;
var p2;
var M3;
(function(M3) {
    var Utils = function Utils() {
        "use strict";
        _class_call_check(this, Utils);
    };
    M3.Utils = Utils;
})(M3 || (M3 = {}));
