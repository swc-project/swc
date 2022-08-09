// @strict: true
// Literal enum type
var E1;
(function(E1) {
    E1[E1["a"] = 1] = "a";
    E1[E1["b"] = 2] = "b";
})(E1 || (E1 = {}));
var // Numeric enum type
E2;
(function(E2) {
    E2[E2["a"] = 1] = "a";
    E2[E2["b"] = 2] = "b";
})(E2 || (E2 = {}));
function f1(v) {
    if (v !== 0) {
        v;
    }
    if (v !== 1) {
        v;
    }
    if (v !== 2) {
        v;
    }
    if (v !== 3) {
        v;
    }
}
function f2(v) {
    if (v !== 0) {
        v;
    }
    if (v !== 1) {
        v;
    }
    if (v !== 2) {
        v;
    }
    if (v !== 3) {
        v;
    }
}
