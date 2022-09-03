//// [typeGuardOfFormTypeOfOther.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
var str, bool, num, strOrNum, strOrBool, numOrBool, strOrNumOrBool, strOrC, numOrC, boolOrC, emptyObj, c, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
if ((void 0 === strOrC ? "undefined" : _type_of(strOrC)) === "Object") ;
else var r2 = strOrC;
if ((void 0 === numOrC ? "undefined" : _type_of(numOrC)) === "Object") ;
else var r3 = numOrC;
if ((void 0 === boolOrC ? "undefined" : _type_of(boolOrC)) === "Object") ;
else var r4 = boolOrC;
if ((void 0 === strOrC ? "undefined" : _type_of(strOrC)) === "Object") ;
else var r5 = strOrC;
if ((void 0 === strOrNumOrBool ? "undefined" : _type_of(strOrNumOrBool)) === "Object") var q1 = strOrNumOrBool;
else var q2 = strOrNumOrBool;
if ((void 0 === strOrC ? "undefined" : _type_of(strOrC)) !== "Object") var r2 = strOrC;
if ((void 0 === numOrC ? "undefined" : _type_of(numOrC)) !== "Object") var r3 = numOrC;
if ((void 0 === boolOrC ? "undefined" : _type_of(boolOrC)) !== "Object") var r4 = boolOrC;
if ((void 0 === strOrNumOrBool ? "undefined" : _type_of(strOrNumOrBool)) !== "Object") var q11 = strOrNumOrBool;
else var q21 = strOrNumOrBool;
