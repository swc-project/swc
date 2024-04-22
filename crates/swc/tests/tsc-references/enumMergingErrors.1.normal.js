//// [enumMergingErrors.ts]
// Enum with constant, computed, constant members split across 3 declarations with the same root module
var M;
(function(M) {
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
    })(E1 = M.E1 || (M.E1 = {}));
    var E2;
    (function(E2) {
        E2[E2["C"] = 0] = "C";
    })(E2 = M.E2 || (M.E2 = {}));
    var E3;
    (function(E3) {
        E3[E3["A"] = 0] = "A";
    })(E3 = M.E3 || (M.E3 = {}));
})(M || (M = {}));
(function(M) {
    var E1;
    (function(E1) {
        E1[E1["B"] = 'foo'.length] = "B";
    })(E1 = M.E1 || (M.E1 = {}));
    var E2;
    (function(E2) {
        E2[E2["B"] = 'foo'.length] = "B";
    })(E2 = M.E2 || (M.E2 = {}));
    var E3;
    (function(E3) {
        E3[E3["C"] = 0] = "C";
    })(E3 = M.E3 || (M.E3 = {}));
})(M || (M = {}));
(function(M) {
    var E1;
    (function(E1) {
        E1[E1["C"] = 0] = "C";
    })(E1 = M.E1 || (M.E1 = {}));
    var E2;
    (function(E2) {
        E2[E2["A"] = 0] = "A";
    })(E2 = M.E2 || (M.E2 = {}));
    var E3;
    (function(E3) {
        E3[E3["B"] = 'foo'.length] = "B";
    })(E3 = M.E3 || (M.E3 = {}));
})(M || (M = {}));
var M1;
// Enum with no initializer in either declaration with constant members with the same root module
(function(M1) {
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
    })(E1 = M1.E1 || (M1.E1 = {}));
})(M1 || (M1 = {}));
(function(M1) {
    var E1;
    (function(E1) {
        E1[E1["B"] = 0] = "B";
    })(E1 = M1.E1 || (M1.E1 = {}));
})(M1 || (M1 = {}));
(function(M1) {
    var E1;
    (function(E1) {
        E1[E1["C"] = 0] = "C";
    })(E1 = M1.E1 || (M1.E1 = {}));
})(M1 || (M1 = {}));
var M2;
// Enum with initializer in only one of three declarations with constant members with the same root module
(function(M2) {
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
    })(E1 = M2.E1 || (M2.E1 = {}));
})(M2 || (M2 = {}));
(function(M2) {
    var E1;
    (function(E1) {
        E1[E1["B"] = 0] = "B";
    })(E1 = M2.E1 || (M2.E1 = {}));
})(M2 || (M2 = {}));
(function(M2) {
    var E1;
    (function(E1) {
        E1[E1["C"] = 0] = "C";
    })(E1 = M2.E1 || (M2.E1 = {}));
})(M2 || (M2 = {}));
