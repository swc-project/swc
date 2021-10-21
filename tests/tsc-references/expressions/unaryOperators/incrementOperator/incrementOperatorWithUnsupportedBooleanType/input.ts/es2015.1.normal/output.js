// ++ operator on boolean type
var BOOLEAN;
function foo() {
    return true;
}
class A {
    static foo() {
        return true;
    }
}
var M1;
(function(M) {
    var n;
    M.n = n;
})(M1 || (M1 = {
}));
var objA = new A();
// boolean type var
var ResultIsNumber1 = ++BOOLEAN;
var ResultIsNumber2 = BOOLEAN++;
// boolean type literal
var ResultIsNumber3 = ++true;
var ResultIsNumber4 = ++{
    x: true,
    y: false
};
var ResultIsNumber5 = ++{
    x: true,
    y: (n)=>{
        return n;
    }
};
var ResultIsNumber6 = true++;
var ResultIsNumber7 = {
    x: true,
    y: false
}++;
var ResultIsNumber8 = {
    x: true,
    y: (n)=>{
        return n;
    }
}++;
// boolean type expressions
var ResultIsNumber9 = ++objA.a;
var ResultIsNumber10 = ++M1.n;
var ResultIsNumber11 = ++foo();
var ResultIsNumber12 = ++A.foo();
var ResultIsNumber13 = foo()++;
var ResultIsNumber14 = A.foo()++;
var ResultIsNumber15 = objA.a++;
var ResultIsNumber16 = M1.n++;
// miss assignment operators
++true;
++BOOLEAN;
++foo();
++objA.a;
++M1.n;
++objA.a, M1.n;
true++;
BOOLEAN++;
foo()++;
objA.a++;
M1.n++;
objA.a++, M1.n++;
