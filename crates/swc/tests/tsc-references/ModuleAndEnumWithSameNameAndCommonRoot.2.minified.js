//// [ModuleAndEnumWithSameNameAndCommonRoot.ts]
var enumdule, enumdule1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(enumdule || (enumdule = {})).Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, (enumdule1 = enumdule)[enumdule1.Red = 0] = "Red", enumdule1[enumdule1.Blue = 1] = "Blue", new enumdule.Point(0, 0);
