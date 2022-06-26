var M;
(function(M) {
    class A {
    }
    M.A = A;
    class B extends A {
    }
    M.B = B;
})(M || (M = {}));
new M.A;
new M.B;
