class C extends N1.E {
} // error
var M1;
(function(M) {
    class D extends C {
    }
    M.D = D;
})(M1 || (M1 = {
}));
var N1;
(function(N) {
    class E extends M1.D {
    }
    N.E = E;
})(N1 || (N1 = {
}));
var O;
(function(O) {
    class C2 extends Q1.E2 {
    } // error
    var P1;
    (function(P) {
        class D2 extends C2 {
        }
        P.D2 = D2;
    })(P1 || (P1 = {
    }));
    var Q1;
    (function(Q) {
        class E2 extends P1.D2 {
        }
        Q.E2 = E2;
    })(Q1 || (Q1 = {
    }));
})(O || (O = {
}));
