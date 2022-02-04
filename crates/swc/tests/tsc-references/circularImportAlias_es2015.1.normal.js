// expected no error
var B;
(function(B1) {
    var a = A;
    B1.a = a;
    class D extends a.C {
    }
    B1.D = D;
})(B || (B = {}));
var A;
(function(A1) {
    class C {
    }
    A1.C = C;
    var b = B;
    A1.b = b;
})(A || (A = {}));
var c;
var c = new B.a.C();
