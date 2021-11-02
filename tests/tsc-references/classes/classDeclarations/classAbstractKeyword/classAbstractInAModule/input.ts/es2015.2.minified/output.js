var M1;
!function(M) {
    class A {
    }
    M.A = A, M.B = class extends A {
    };
}(M1 || (M1 = {
})), new M1.A, new M1.B;
