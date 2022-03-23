// Enum with constant, computed, constant members split across 3 declarations with the same root module
var M;
(function(M3) {
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
    })(E1 = M3.E1 || (M3.E1 = {}));
    var E2;
    (function(E2) {
        E2[E2["C"] = 0] = "C";
    })(E2 = M3.E2 || (M3.E2 = {}));
    var E3;
    (function(E3) {
        E3[E3["A"] = 0] = "A";
    })(E3 = M3.E3 || (M3.E3 = {}));
})(M || (M = {}));
(function(M4) {
    var E1;
    (function(E1) {
        E1[E1["B"] = "foo".length] = "B";
    })(E1 = M4.E1 || (M4.E1 = {}));
    var E2;
    (function(E2) {
        E2[E2["B"] = "foo".length] = "B";
    })(E2 = M4.E2 || (M4.E2 = {}));
    var E3;
    (function(E3) {
        E3[E3["C"] = 0] = "C";
    })(E3 = M4.E3 || (M4.E3 = {}));
})(M || (M = {}));
(function(M5) {
    var E1;
    (function(E1) {
        E1[E1["C"] = 0] = "C";
    })(E1 = M5.E1 || (M5.E1 = {}));
    var E2;
    (function(E2) {
        E2[E2["A"] = 0] = "A";
    })(E2 = M5.E2 || (M5.E2 = {}));
    var E3;
    (function(E3) {
        E3[E3["B"] = "foo".length] = "B";
    })(E3 = M5.E3 || (M5.E3 = {}));
})(M || (M = {}));
// Enum with no initializer in either declaration with constant members with the same root module
var M1;
(function(M11) {
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
    })(E1 = M11.E1 || (M11.E1 = {}));
})(M1 || (M1 = {}));
(function(M12) {
    var E1;
    (function(E1) {
        E1[E1["B"] = 0] = "B";
    })(E1 = M12.E1 || (M12.E1 = {}));
})(M1 || (M1 = {}));
(function(M13) {
    var E1;
    (function(E1) {
        E1[E1["C"] = 0] = "C";
    })(E1 = M13.E1 || (M13.E1 = {}));
})(M1 || (M1 = {}));
// Enum with initializer in only one of three declarations with constant members with the same root module
var M2;
(function(M21) {
    var E1;
    (function(E1) {
        E1[E1["A"] = 0] = "A";
    })(E1 = M21.E1 || (M21.E1 = {}));
})(M2 || (M2 = {}));
(function(M22) {
    var E1;
    (function(E1) {
        E1[E1["B"] = 0] = "B";
    })(E1 = M22.E1 || (M22.E1 = {}));
})(M2 || (M2 = {}));
(function(M23) {
    var E1;
    (function(E1) {
        E1[E1["C"] = 0] = "C";
    })(E1 = M23.E1 || (M23.E1 = {}));
})(M2 || (M2 = {}));
