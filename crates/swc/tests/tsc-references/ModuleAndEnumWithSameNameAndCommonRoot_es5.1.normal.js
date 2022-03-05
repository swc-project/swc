import * as swcHelpers from "@swc/helpers";
var enumdule;
(function(enumdule1) {
    var Point = function Point(x1, y1) {
        "use strict";
        swcHelpers.classCallCheck(this, Point);
        this.x = x1;
        this.y = y1;
    };
    enumdule1.Point = Point;
})(enumdule || (enumdule = {}));
(function(enumdule) {
    enumdule[enumdule["Red"] = 0] = "Red";
    enumdule[enumdule["Blue"] = 1] = "Blue";
})(enumdule || (enumdule = {}));
var x;
var x = enumdule.Red;
var y;
var y = new enumdule.Point(0, 0);
