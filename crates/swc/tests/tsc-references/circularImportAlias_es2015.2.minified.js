var B, A;
!function(B) {
    var a = A;
    B.a = a;
    class D extends a.C {
    }
    B.D = D;
}(B || (B = {})), function(A) {
    A.C = class {
    };
    var b = B;
    A.b = b;
}(A || (A = {})), new B.a.C();
