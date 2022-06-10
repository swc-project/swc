class C {
}
class C2 extends C {
}
class D {
}
function F(x) {
    return 42;
}
var M;
(function(M1) {
    class A {
    }
    M1.A = A;
    function F2(x) {
        return x.toString();
    }
    M1.F2 = F2;
})(M || (M = {}));
// all of these are errors
var a;
var a = 1;
var a = 'a string';
var a = new C();
var a = new D();
var a = M;
var b;
var b = new C();
var b = new C2();
var f = F;
var f = (x)=>'';
var arr;
var arr = [
    1,
    2,
    3,
    4
];
var arr = [
    new C(),
    new C2(),
    new D()
];
var arr2 = [
    new D()
];
var arr2 = new Array();
var m;
var m = M.A;
