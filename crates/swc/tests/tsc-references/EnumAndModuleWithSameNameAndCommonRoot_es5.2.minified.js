var enumdule;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
!function(enumdule) {
    enumdule[enumdule.Red = 0] = "Red", enumdule[enumdule.Blue = 1] = "Blue";
}(enumdule || (enumdule = {})), function(enumdule) {
    var Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    enumdule.Point = Point;
}(enumdule || (enumdule = {})), enumdule.Red, new enumdule.Point(0, 0);
