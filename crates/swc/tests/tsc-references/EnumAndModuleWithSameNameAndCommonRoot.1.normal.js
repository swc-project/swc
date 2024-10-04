//// [EnumAndModuleWithSameNameAndCommonRoot.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var enumdule = /*#__PURE__*/ function(enumdule) {
    enumdule[enumdule["Red"] = 0] = "Red";
    enumdule[enumdule["Blue"] = 1] = "Blue";
    return enumdule;
}(enumdule || {});
(function(enumdule) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    enumdule.Point = Point;
})(enumdule || (enumdule = {}));
var x;
var x = 0;
var y;
var y = new enumdule.Point(0, 0);
