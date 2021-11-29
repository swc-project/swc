class C extends N.E {
} // error
var M;
(function(M) {
    class D extends C {
    }
    M.D = D;
})(M || (M = {
}));
var N;
(function(N) {
    class E extends M.D {
    }
    N.E = E;
})(N || (N = {
}));
var O;
(function(O) {
    class C2 extends Q.E2 {
    } // error
    let P;
    (function(P) {
        class D2 extends C2 {
        }
        P.D2 = D2;
    })(P || (P = {
    }));
    let Q1;
    (function(Q1) {
        class E2 extends P.D2 {
        }
        Q1.E2 = E2;
    })(Q1 || (Q1 = {
    }));
})(O || (O = {
}));
