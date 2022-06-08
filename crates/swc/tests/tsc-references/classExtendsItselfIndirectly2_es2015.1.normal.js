class C extends N.E {
} // error
var M;
(function(M1) {
    class D extends C {
    }
    M1.D = D;
})(M || (M = {}));
var N;
(function(N1) {
    class E extends M.D {
    }
    N1.E = E;
})(N || (N = {}));
var O;
(function(O) {
    class C2 extends Q1.E2 {
    } // error
    let P1;
    (function(P) {
        class D2 extends C2 {
        }
        P.D2 = D2;
    })(P1 || (P1 = {}));
    let Q1;
    (function(Q) {
        class E2 extends P1.D2 {
        }
        Q.E2 = E2;
    })(Q1 || (Q1 = {}));
})(O || (O = {}));
