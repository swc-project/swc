var // - operator on enum type
ENUM;
(function(ENUM) {
})(ENUM || (ENUM = {
}));
var ENUM11;
(function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
})(ENUM11 || (ENUM11 = {
}));
// enum type var
var ResultIsNumber1 = -ENUM;
// expressions
var ResultIsNumber2 = -ENUM11["B"];
var ResultIsNumber3 = -(ENUM11.B + ENUM11[""]);
// miss assignment operators
-ENUM;
-ENUM11;
-ENUM11["B"];
-ENUM, ENUM11;
