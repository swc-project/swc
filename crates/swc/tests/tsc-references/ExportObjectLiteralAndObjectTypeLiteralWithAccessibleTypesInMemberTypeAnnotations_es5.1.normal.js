import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    var Origin = A1.Origin = {
        x: 0,
        y: 0
    };
    var Unity = A1.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
})(A || (A = {}));
