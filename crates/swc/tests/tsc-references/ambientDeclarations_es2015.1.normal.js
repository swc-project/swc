// Ambient variable without type annotation
var // Ambient enum
E1;
(function(E1) {
    E1[E1["x"] = 0] = "x";
    E1[E1["y"] = 1] = "y";
    E1[E1["z"] = 2] = "z";
})(E1 || (E1 = {}));
var // Ambient enum with integer literal initializer
E2;
(function(E2) {
    E2[E2["q"] = 0] = "q";
    E2[E2["a"] = 1] = "a";
    E2[E2["b"] = 2] = "b";
    E2[E2["c"] = 2] = "c";
    E2[E2["d"] = 3] = "d";
})(E2 || (E2 = {}));
var // Ambient enum members are always exported with or without export keyword
E3;
(function(E3) {
    E3[E3["A"] = 0] = "A";
})(E3 || (E3 = {}));
var x = E3.B;
// Ambient module members are always exported with or without export keyword
var p = M1.x;
var q = M1.fn();
