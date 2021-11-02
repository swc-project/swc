var // ++ operator on enum type
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
var ResultIsNumber1 = ++ENUM;
var ResultIsNumber2 = ++ENUM11;
var ResultIsNumber3 = ENUM++;
var ResultIsNumber4 = ENUM11++;
// enum type expressions
var ResultIsNumber5 = ++ENUM[1] + ENUM[2];
var ResultIsNumber6 = ENUM[1] + ENUM[2]++;
// miss assignment operator
++ENUM;
++ENUM11;
ENUM++;
ENUM11++;
