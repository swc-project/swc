import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var str;
var bool;
var num;
var strOrNum;
var strOrBool;
var numOrBool;
var strOrNumOrBool;
var strOrC;
var numOrC;
var boolOrC;
var c;
//	A type guard of the form typeof x === s, 
//  where s is a string literal with the value 'string', 'number', or 'boolean',
//  - when true, narrows the type of x to the given primitive type, or
//  - when false, removes the primitive type from the type of x.
if (typeof strOrNum === "string") {
    str = strOrNum; // string
} else {
    num === strOrNum; // number
}
if (typeof strOrBool === "string") {
    str = strOrBool; // string
} else {
    bool = strOrBool; // boolean
}
if (typeof strOrNumOrBool === "string") {
    str = strOrNumOrBool; // string
} else {
    numOrBool = strOrNumOrBool; // number | boolean
}
if (typeof strOrC === "string") {
    str = strOrC; // string
} else {
    c = strOrC; // C
}
if (typeof numOrBool === "string") {
    var x1 = numOrBool; // {}
} else {
    var x2 = numOrBool; // number | boolean
}
// A type guard of the form typeof x !== s, where s is a string literal,
//  - when true, narrows the type of x by typeof x === s when false, or
//  - when false, narrows the type of x by typeof x === s when true.
if (typeof strOrNum !== "string") {
    num === strOrNum; // number
} else {
    str = strOrNum; // string
}
if (typeof strOrBool !== "string") {
    bool = strOrBool; // boolean
} else {
    str = strOrBool; // string
}
if (typeof strOrNumOrBool !== "string") {
    numOrBool = strOrNumOrBool; // number | boolean
} else {
    str = strOrNumOrBool; // string
}
if (typeof strOrC !== "string") {
    c = strOrC; // C
} else {
    str = strOrC; // string
}
if (typeof numOrBool !== "string") {
    var x11 = numOrBool; // number | boolean
} else {
    var x21 = numOrBool; // {}
}
