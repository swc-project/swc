// - operator on any type
var ANY;
var ANY1;
var ANY2 = [
    "",
    ""
];
var obj;
var obj1 = {
    x: "",
    y: ()=>{
    }
};
function foo() {
    var a;
    return a;
}
class A {
    static foo() {
        var a;
        return a;
    }
}
var M1;
(function(M) {
    var n;
    M.n = n;
})(M1 || (M1 = {
}));
var objA = new A();
// any type var
var ResultIsNumber1 = -ANY1;
var ResultIsNumber2 = -ANY2;
var ResultIsNumber3 = -A;
var ResultIsNumber4 = -M1;
var ResultIsNumber5 = -obj;
var ResultIsNumber6 = -obj1;
// any type literal
var ResultIsNumber7 = -undefined;
var ResultIsNumber = -null;
// any type expressions
var ResultIsNumber8 = -ANY2[0];
var ResultIsNumber9 = -obj1.x;
var ResultIsNumber10 = -obj1.y;
var ResultIsNumber11 = -objA.a;
var ResultIsNumber12 = -M1.n;
var ResultIsNumber13 = -foo();
var ResultIsNumber14 = -A.foo();
var ResultIsNumber15 = -(ANY - ANY1);
// miss assignment operators
-ANY;
-ANY1;
-ANY2[0];
-ANY, ANY1;
-objA.a;
-M1.n;
