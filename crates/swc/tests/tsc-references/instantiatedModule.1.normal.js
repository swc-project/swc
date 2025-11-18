//// [instantiatedModule.ts]
// adding the var makes this an instantiated module
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(M) {
    M.Point = 1;
})(M || (M = {}));
// primary expression
var m;
var m = M;
var a1;
var a1 = M.Point;
var a1 = m.Point;
var p1;
var p1;
// making the point a class instead of an interface 
// makes this an instantiated mmodule
(function(M2) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point() {
            _class_call_check(this, Point);
        }
        Point.Origin = function Origin() {
            return {
                x: 0,
                y: 0
            };
        };
        return Point;
    }();
    M2.Point = Point;
})(M2 || (M2 = {}));
var m2;
var m2 = M2;
// static side of the class
var a2;
var a2 = m2.Point;
var a2 = M2.Point;
var o = a2.Origin();
var p2;
var p2;
var p2 = new m2.Point();
var p2 = new M2.Point();
(function(M3) {
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(M3.Color || (M3.Color = {}));
})(M3 || (M3 = {}));
var m3;
var m3 = M3;
var a3;
var a3 = m3.Color;
var a3 = M3.Color;
var blue = a3.Blue;
var p3;
var p3 = M3.Color.Red;
var p3 = m3.Color.Blue;
var M, M2, M3;
