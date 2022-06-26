import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var str;
var bool;
var num;
var strOrNum;
var strOrNumOrBool;
var numOrBool;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c;
var cOrBool;
var strOrNumOrBoolOrC;
// A type guard of the form expr1 || expr2
//  - when true, narrows the type of x to T1 | T2, where T1 is the type of x narrowed by expr1 when true, 
//    and T2 is the type of x narrowed by expr1 when false and then by expr2 when true, or
//  - when false, narrows the type of x by expr1 when false and then by expr2 when false.
// (typeguard1 || typeguard2)
if (typeof strOrNumOrBool === "string" || typeof strOrNumOrBool === "number") {
    strOrNum = strOrNumOrBool; // string | number
} else {
    bool = strOrNumOrBool; // boolean
}
// (typeguard1 || typeguard2 || typeguard3)
if (typeof strOrNumOrBoolOrC === "string" || typeof strOrNumOrBoolOrC === "number" || typeof strOrNumOrBoolOrC === "boolean") {
    strOrNumOrBool = strOrNumOrBoolOrC; // string | number | boolean
} else {
    c = strOrNumOrBoolOrC; // C
}
// (typeguard1 || typeguard2 || typeguard11(onAnotherType))
if (typeof strOrNumOrBoolOrC === "string" || typeof strOrNumOrBoolOrC === "number" || typeof strOrNumOrBool !== "boolean") {
    var r1 = strOrNumOrBoolOrC; // string | number | boolean | C
    var r2 = strOrNumOrBool;
} else {
    cOrBool = strOrNumOrBoolOrC; // C | boolean
    bool = strOrNumOrBool; // boolean
}
// (typeguard1) || simpleExpr
if (typeof strOrNumOrBool === "string" || numOrBool !== strOrNumOrBool) {
    var r3 = strOrNumOrBool; // string | number | boolean
} else {
    numOrBool = strOrNumOrBool; // number | boolean
}
