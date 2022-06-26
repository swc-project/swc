var M;
!function(M) {
    class A {
    }
    M.A = A, M.B = class extends A {
    };
}(M || (M = {})), new M.A, new M.B;
