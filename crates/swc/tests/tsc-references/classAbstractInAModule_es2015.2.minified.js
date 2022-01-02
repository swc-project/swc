var M;
!function(M1) {
    class A {
    }
    M1.A = A, M1.B = class extends A {
    };
}(M || (M = {})), new M.A, new M.B;
