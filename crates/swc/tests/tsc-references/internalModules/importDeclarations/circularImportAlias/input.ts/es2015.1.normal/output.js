// expected no error
var B;
(function(B1) {
    B1.a = A;
    class D extends a.C {
    }
    B1.D = D;
})(B || (B = {
}));
var A;
(function(A1) {
    class C {
    }
    A1.C = C;
    A1.b = B;
})(A || (A = {
}));
var c;
var c = new B.a.C();
