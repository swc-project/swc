var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    A.Origin = {
        x: 0,
        y: 0
    }, A.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
}(A || (A = {}));
