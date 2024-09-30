export var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 1] = "A";
    return E;
}({});
(function(E) {
    E[E["B"] = 2] = "B";
})(E);
var E1 = /*#__PURE__*/ function(E1) {
    E1[E1["C"] = 3] = "C";
    return E1;
}(E1 || {});
(function(E1) {
    E1[E1["D"] = 4] = "D";
})(E1);
(function(N) {
    (function(E) {
        E[E["A"] = 1] = "A";
    })(N.E || (N.E = {}));
    (function(E) {
        E[E["B"] = 2] = "B";
    })(N.E);
    let E1 = /*#__PURE__*/ function(E1) {
        E1[E1["C"] = 3] = "C";
        return E1;
    }({});
    (function(E1) {
        E1[E1["D"] = 4] = "D";
    })(E1);
})(N || (N = {}));
(function(N) {
    (function(E) {
        E[E["c"] = 3] = "c";
    })(N.E || (N.E = {}));
    (function(E) {
        E[E["d"] = 4] = "d";
    })(N.E);
    (function(N1) {
        (function(E2) {
            E2[E2["e"] = 5] = "e";
        })(N1.E2 || (N1.E2 = {}));
    })(N.N1 || (N.N1 = {}));
    (function(N1) {
        (function(E2) {
            E2[E2["f"] = 6] = "f";
        })(N1.E2 || (N1.E2 = {}));
    })(N.N1 || (N.N1 = {}));
    (function(N2) {
        let E3 = /*#__PURE__*/ function(E3) {
            E3[E3["g"] = 7] = "g";
            return E3;
        }({});
    })(N2 || (N2 = {}));
    var N2;
})(N || (N = {}));
(function(N1) {
    (function(E2) {
        E2[E2["e"] = 5] = "e";
    })(N1.E2 || (N1.E2 = {}));
})(N1 || (N1 = {}));
(function(N1) {
    (function(E2) {
        E2[E2["f"] = 6] = "f";
    })(N1.E2 || (N1.E2 = {}));
})(N1 || (N1 = {}));
export var N, N1;
