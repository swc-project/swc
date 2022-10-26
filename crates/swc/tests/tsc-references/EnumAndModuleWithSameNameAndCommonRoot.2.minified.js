//// [EnumAndModuleWithSameNameAndCommonRoot.ts]
var enumdule;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(enumdule) {
    enumdule[enumdule.Red = 0] = "Red", enumdule[enumdule.Blue = 1] = "Blue";
}(enumdule || (enumdule = {})), (enumdule || (enumdule = {})).Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point), this.x = x, this.y = y;
}, enumdule.Red, new enumdule.Point(0, 0);
