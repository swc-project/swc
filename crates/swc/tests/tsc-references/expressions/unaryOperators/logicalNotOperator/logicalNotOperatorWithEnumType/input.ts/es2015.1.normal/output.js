var // ! operator on enum type
ENUM;
(function(ENUM2) {
    ENUM2[ENUM2["A"] = 0] = "A";
    ENUM2[ENUM2["B"] = 1] = "B";
    ENUM2[ENUM2["C"] = 2] = "C";
})(ENUM || (ENUM = {
}));
var ENUM1;
(function(ENUM1) {
})(ENUM1 || (ENUM1 = {
}));
// enum type var
var ResultIsBoolean1 = !ENUM;
// enum type expressions
var ResultIsBoolean2 = !ENUM["B"];
var ResultIsBoolean3 = !(ENUM.B + ENUM["C"]);
// multiple ! operators
var ResultIsBoolean4 = !!ENUM;
var ResultIsBoolean5 = !!!(ENUM["B"] + ENUM.C);
// miss assignment operators
!ENUM;
!ENUM1;
!ENUM.B;
!ENUM, ENUM1;
