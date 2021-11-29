// expected no error
var B;
(function(B) {
    B.a = A;
    class D extends a.C {
    }
    B.D = D;
})(B || (B = {
}));
var A;
(function(A) {
    class C {
    }
    A.C = C;
    A.b = B;
})(A || (A = {
}));
var c;
var c = new B.a.C();
