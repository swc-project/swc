var M;
(function(M1) {
    class A {
    }
    M1.A = A;
    class B extends A {
    }
    M1.B = B;
})(M || (M = {}));
new M.A;
new M.B;
