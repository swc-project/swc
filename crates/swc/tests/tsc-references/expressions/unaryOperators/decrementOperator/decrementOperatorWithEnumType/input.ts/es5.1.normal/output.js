var // -- operator on enum type
ENUM1;
(function(ENUM11) {
    ENUM11[ENUM11["A"] = 0] = "A";
    ENUM11[ENUM11["B"] = 1] = "B";
    ENUM11[ENUM11[""] = 2] = "";
})(ENUM1 || (ENUM1 = {
}));
// expression
var ResultIsNumber1 = --ENUM1["A"];
var ResultIsNumber2 = ENUM1.A--;
// miss assignment operator
--ENUM1["A"];
ENUM1[A]--;
