//// [objectTypeWithDuplicateNumericProperty.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, b = {
    1: 1,
    1.0: 1,
    1.: 1,
    1.00: 1
};
