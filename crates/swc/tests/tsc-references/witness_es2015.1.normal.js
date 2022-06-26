// Initializers
var varInit = varInit; // any
var pInit;
function fn(pInit = pInit) {
    var pInit;
}
class InitClass {
    fn() {
        var y = this.x;
        var y;
    }
    constructor(){
        this.x = this.x;
    }
}
// Return type
function fnReturn1() {
    return fnReturn1();
}
var a;
var a = fnReturn1();
function fnReturn2() {
    return fnReturn2;
}
var fnr2 = fnReturn2();
// Comma
var co1 = (co1, 3);
var co1;
var co2 = (3, co2);
var co2;
var co3 = (co1, co2, co3, co1);
var co3;
// Assignment
var as1 = as1 = 2;
var as1;
var as2 = as2 = as2 = 2;
var as2;
// Conditional
var cnd1 = cnd1 ? 0 : 1;
var cnd1;
var cnd2 = cnd1 ? cnd1 ? '' : "" : '';
var cnd2;
// ||
var or1 = or1 || '';
var or1;
var or2 = '' || or2;
var or2;
var or3 = or3 || or3;
var or3;
// &&
var and1 = and1 && '';
var and1;
var and2 = '' && and2;
var and2;
var and3 = and3 && and3;
var and3;
// function call return type
function fnCall() {
    return fnCall();
}
var fnCallResult = fnCall();
var fnCallResult;
// Call argument
function fnArg1(x, y) {
    var x;
    fnArg1(fnArg1, 0);
}
function overload1() {
    return undefined;
}
function fnArg2() {
    return overload1(fnArg2);
}
var t = fnArg2(); // t: should be 'any', but is 'string'
// New operator
class C {
    fn1() {
        return new (this.fn1())();
    }
    fn2() {
        return new (this.fn2());
    }
    fn3() {
        var a;
        return new a(this.fn3);
    }
}
function fn5() {
    var a;
    return new a(fn5);
}
var fn5r = fn5(); // fn5r: should be 'any', but is 'number'
// Property access
var propAcc1 = {
    m: propAcc1.m
};
var propAcc1;
// Property access of module member
var M2;
(function(M21) {
    var x = M21.x = M2.x;
    var y = x;
    var y;
})(M2 || (M2 = {}));
// Property access of class instance type
class C2 {
    constructor(){
        this.n = this.n // n: any
        ;
    }
}
var c2inst = new C2().n;
var c2inst;
// Constructor function property access
class C3 {
}
C3.q = C3.q;
var qq = C3.q;
var qq; // Parentheses - tested a bunch above
