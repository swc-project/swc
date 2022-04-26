// expected no error
var B;
(function(B1) {
    var a = A;
    B1.a = a;
    class D extends a.C {
    }
    B1.D = D;
})(B || (B = {}));
var A1;
(function(A) {
    class C {
    }
    A.C = C;
    var b = B;
    A.b = b;
})(A1 || (A1 = {}));
var c;
var c = new B.a.C();
