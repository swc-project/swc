//// [ModuleAndEnumWithSameNameAndCommonRoot.ts]
var enumdule;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(enumdule || (enumdule = {})).Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point), this.x = x, this.y = y;
}, function(enumdule) {
    enumdule[enumdule.Red = 0] = "Red", enumdule[enumdule.Blue = 1] = "Blue";
}(enumdule || (enumdule = {})), enumdule.Red, new enumdule.Point(0, 0);
