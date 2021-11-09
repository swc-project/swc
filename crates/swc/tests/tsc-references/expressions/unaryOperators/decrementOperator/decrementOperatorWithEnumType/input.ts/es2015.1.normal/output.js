var // -- operator on enum type
ENUM11;
(function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
})(ENUM11 || (ENUM11 = {
}));
// expression
var ResultIsNumber1 = --ENUM11["A"];
var ResultIsNumber2 = ENUM11.A--;
// miss assignment operator
--ENUM11["A"];
ENUM11[A]--;
