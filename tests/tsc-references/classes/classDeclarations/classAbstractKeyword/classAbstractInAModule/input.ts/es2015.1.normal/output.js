var M1;
(function(M) {
    class A {
    }
    M.A = A;
    class B extends A {
    }
    M.B = B;
})(M1 || (M1 = {
}));
new M1.A;
new M1.B;
