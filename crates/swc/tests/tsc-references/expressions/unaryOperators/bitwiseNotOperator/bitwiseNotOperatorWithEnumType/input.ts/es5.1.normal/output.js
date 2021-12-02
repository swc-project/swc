var // @allowUnreachableCode: true
// ~ operator on enum type
ENUM1;
(function(ENUM11) {
    ENUM11[ENUM11["A"] = 0] = "A";
    ENUM11[ENUM11["B"] = 1] = "B";
    ENUM11[ENUM11[""] = 2] = "";
})(ENUM1 || (ENUM1 = {
}));
// enum type var
var ResultIsNumber1 = ~ENUM1;
// enum type expressions
var ResultIsNumber2 = ~ENUM1["A"];
var ResultIsNumber3 = ~(ENUM1.A + ENUM1["B"]);
// multiple ~ operators
var ResultIsNumber4 = ~~~(ENUM1["A"] + ENUM1.B);
// miss assignment operators
~ENUM1;
~ENUM1["A"];
~ENUM1.A, ~ENUM1["B"];
