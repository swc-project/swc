//// [typeGuardOfFormTypeOfEqualEqualHasNoEffect.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
var strOrNum, strOrBool, numOrBool, strOrC, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
if ("string" == typeof strOrNum) var r1 = strOrNum;
else var r1 = strOrNum;
if ("boolean" == typeof strOrBool) var r2 = strOrBool;
else var r2 = strOrBool;
if ("number" == typeof numOrBool) var r3 = numOrBool;
else var r3 = numOrBool;
if ((void 0 === strOrC ? "undefined" : _type_of(strOrC)) == "Object") var r4 = strOrC;
else var r4 = strOrC;
