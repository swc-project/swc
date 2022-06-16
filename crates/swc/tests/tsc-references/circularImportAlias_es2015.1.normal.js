// expected no error
var B;
(function(B) {
    var a = A;
    B.a = a;
    class D extends a.C {
    }
    B.D = D;
})(B || (B = {}));
var A;
(function(A) {
    class C {
    }
    A.C = C;
    var b = B;
    A.b = b;
})(A || (A = {}));
var c;
var c = new B.a.C();
