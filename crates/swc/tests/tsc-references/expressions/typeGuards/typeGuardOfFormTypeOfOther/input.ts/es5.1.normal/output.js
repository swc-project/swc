function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
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
var emptyObj;
var c;
// A type guard of the form typeof x === s, 
// where s is a string literal with any value but 'string', 'number' or 'boolean',
//  - when true, removes the primitive types string, number, and boolean from the type of x, or
//  - when false, has no effect on the type of x.
if ((typeof strOrC === "undefined" ? "undefined" : _typeof(strOrC)) === "Object") {
    c = strOrC; // C
} else {
    var r2 = strOrC; // string
}
if ((typeof numOrC === "undefined" ? "undefined" : _typeof(numOrC)) === "Object") {
    c = numOrC; // C
} else {
    var r3 = numOrC; // number
}
if ((typeof boolOrC === "undefined" ? "undefined" : _typeof(boolOrC)) === "Object") {
    c = boolOrC; // C
} else {
    var r4 = boolOrC; // boolean
}
if ((typeof strOrC === "undefined" ? "undefined" : _typeof(strOrC)) === "Object") {
    c = strOrC; // error: but no narrowing to C
} else {
    var r5 = strOrC; // error: no narrowing to string
}
if ((typeof strOrNumOrBool === "undefined" ? "undefined" : _typeof(strOrNumOrBool)) === "Object") {
    var q1 = strOrNumOrBool; // {}
} else {
    var q2 = strOrNumOrBool; // string | number | boolean
}
// A type guard of the form typeof x !== s, where s is a string literal,
//  - when true, narrows the type of x by typeof x === s when false, or
//  - when false, narrows the type of x by typeof x === s when true.
if ((typeof strOrC === "undefined" ? "undefined" : _typeof(strOrC)) !== "Object") {
    var r2 = strOrC; // string
} else {
    c = strOrC; // C
}
if ((typeof numOrC === "undefined" ? "undefined" : _typeof(numOrC)) !== "Object") {
    var r3 = numOrC; // number
} else {
    c = numOrC; // C
}
if ((typeof boolOrC === "undefined" ? "undefined" : _typeof(boolOrC)) !== "Object") {
    var r4 = boolOrC; // boolean
} else {
    c = boolOrC; // C
}
if ((typeof strOrNumOrBool === "undefined" ? "undefined" : _typeof(strOrNumOrBool)) !== "Object") {
    var q11 = strOrNumOrBool; // string | number | boolean
} else {
    var q21 = strOrNumOrBool; // {}
}
