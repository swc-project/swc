import * as swcHelpers from "@swc/helpers";
!function(enumdule) {
    var Point = function(x, y) {
        "use strict";
        swcHelpers.classCallCheck(this, Point), this.x = x, this.y = y;
    };
    enumdule.Point = Point;
}(enumdule || (enumdule = {})), function(enumdule) {
    enumdule[enumdule.Red = 0] = "Red", enumdule[enumdule.Blue = 1] = "Blue";
}(enumdule || (enumdule = {})), enumdule.Red, new enumdule.Point(0, 0);
