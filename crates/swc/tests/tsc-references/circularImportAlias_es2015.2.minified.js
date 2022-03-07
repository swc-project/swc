var B, A;
!function(B1) {
    var a = A;
    B1.a = a;
    class D extends a.C {
    }
    B1.D = D;
}(B || (B = {})), function(A1) {
    A1.C = class {
    };
    var b = B;
    A1.b = b;
}(A || (A = {})), new B.a.C();
