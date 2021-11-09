var // ++ operator on enum type
ENUM11;
(function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
})(ENUM11 || (ENUM11 = {
}));
// expression
var ResultIsNumber1 = ++ENUM11["B"];
var ResultIsNumber2 = ENUM11.B++;
// miss assignment operator
++ENUM11["B"];
ENUM11.B++;
