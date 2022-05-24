import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C0 = function C0() {
    "use strict";
    _class_call_check(this, C0);
};
var C1 = function C1(n, s) {
    "use strict";
    _class_call_check(this, C1);
};
var T = function T(n) {
    "use strict";
    _class_call_check(this, T);
};
var anyCtor;
var anyCtor1;
var nestedCtor;
// Construct expression with no parentheses for construct signature with 0 parameters
var a = new C0;
var a;
// Generic construct expression with no parentheses
var c1 = new T;
var c1;
// Construct expression where constructor is of type 'any' with no parentheses
var d = new anyCtor;
var d;
// Construct expression where constructor is of type 'any' with > 1 arg
var d = new anyCtor1(undefined);
// Construct expression of type where apparent type has a construct signature with 0 arguments
function newFn1(s) {
    var p = new s;
    var p;
}
// Construct expression of type where apparent type has a construct signature with 1 arguments
function newFn2(s) {
    var p = new s(32);
    var p;
}
// Construct expression of void returning function
function fnVoid() {}
var t = new fnVoid();
var t;
// Chained new expressions
var nested = new new new nestedCtor()()();
var n = new nested();
var n = new nested();
