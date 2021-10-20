var // @allowUnreachableCode: true
// ~ operator on enum type
ENUM11;
(function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
})(ENUM11 || (ENUM11 = {
}));
// enum type var
var ResultIsNumber1 = ~ENUM11;
// enum type expressions
var ResultIsNumber2 = ~ENUM11["A"];
var ResultIsNumber3 = ~(ENUM11.A + ENUM11["B"]);
// multiple ~ operators
var ResultIsNumber4 = ~~~(ENUM11["A"] + ENUM11.B);
// miss assignment operators
~ENUM11;
~ENUM11["A"];
~ENUM11.A, ~ENUM11["B"];
