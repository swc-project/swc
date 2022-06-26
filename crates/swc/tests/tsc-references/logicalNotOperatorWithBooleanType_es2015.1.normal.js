// ! operator on boolean type
var BOOLEAN;
function foo() {
    return true;
}
class A {
    static foo() {
        return false;
    }
}
var M;
(function(M) {
    var n;
    M.n = n;
})(M || (M = {}));
var objA = new A();
// boolean type var
var ResultIsBoolean1 = !BOOLEAN;
// boolean type literal
var ResultIsBoolean2 = !true;
var ResultIsBoolean3 = !{
    x: true,
    y: false
};
// boolean type expressions
var ResultIsBoolean4 = !objA.a;
var ResultIsBoolean5 = !M.n;
var ResultIsBoolean6 = !foo();
var ResultIsBoolean7 = !A.foo();
// multiple ! operators
var ResultIsBoolean = !!BOOLEAN;
// miss assignment operators
!true;
!BOOLEAN;
!foo();
!true, false;
!objA.a;
!M.n;
