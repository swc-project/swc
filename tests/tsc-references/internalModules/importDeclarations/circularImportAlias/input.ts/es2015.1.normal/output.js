// expected no error
var B1;
(function(B) {
    B.a = A1;
    class D extends a.C {
    }
    B.D = D;
})(B1 || (B1 = {
}));
var A1;
(function(A) {
    class C {
    }
    A.C = C;
    A.b = B1;
})(A1 || (A1 = {
}));
var c;
var c = new B1.a.C();
