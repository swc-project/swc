var // ! operator on enum type
ENUM2;
(function(ENUM) {
    ENUM[ENUM["A"] = 0] = "A";
    ENUM[ENUM["B"] = 1] = "B";
    ENUM[ENUM["C"] = 2] = "C";
})(ENUM2 || (ENUM2 = {
}));
var ENUM1;
(function(ENUM1) {
})(ENUM1 || (ENUM1 = {
}));
// enum type var
var ResultIsBoolean1 = !ENUM2;
// enum type expressions
var ResultIsBoolean2 = !ENUM2["B"];
var ResultIsBoolean3 = !(ENUM2.B + ENUM2["C"]);
// multiple ! operators
var ResultIsBoolean4 = !!ENUM2;
var ResultIsBoolean5 = !!!(ENUM2["B"] + ENUM2.C);
// miss assignment operators
!ENUM2;
!ENUM1;
!ENUM2.B;
!ENUM2, ENUM1;
