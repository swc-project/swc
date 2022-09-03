//// [instantiatedModule.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(M || (M = {})).Point = 1;
var M, m, a1, p1, M2, m2, a2, p2, M3, m3, a3, p3, m = M, a1 = M.Point, a1 = m.Point;
!function(M2) {
    var Point = function() {
        "use strict";
        function Point() {
            _class_call_check(this, Point);
        }
        return Point.Origin = function() {
            return {
                x: 0,
                y: 0
            };
        }, Point;
    }();
    M2.Point = Point;
}(M2 || (M2 = {}));
var m2 = M2, a2 = m2.Point, a2 = M2.Point, o = a2.Origin(), p2 = new m2.Point(), p2 = new M2.Point();
!function(M3) {
    var Color;
    (Color = M3.Color || (M3.Color = {}))[Color.Blue = 0] = "Blue", Color[Color.Red = 1] = "Red";
}(M3 || (M3 = {}));
var m3 = M3, a3 = m3.Color, a3 = M3.Color, blue = a3.Blue, p3 = M3.Color.Red, p3 = m3.Color.Blue;
