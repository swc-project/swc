//// [ModuleAndEnumWithSameNameAndCommonRoot.ts]
var enumdule, enumdule1, enumdule2;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
enumdule1 = enumdule || (enumdule = {}), enumdule1.Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, enumdule2 = enumdule || (enumdule = {}), enumdule2[enumdule2.Red = 0] = "Red", enumdule2[enumdule2.Blue = 1] = "Blue", new enumdule.Point(0, 0);
