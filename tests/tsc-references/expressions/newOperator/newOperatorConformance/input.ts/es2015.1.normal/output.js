class C0 {
}
class C1 {
    constructor(n1, s1){
    }
}
class T {
    constructor(n2){
    }
}
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
function fnVoid() {
}
var t = new fnVoid();
var t;
// Chained new expressions
var nested = new new new nestedCtor()()();
var n = new nested();
var n = new nested();
