var // + operator on enum type
ENUM;
(function(ENUM) {
})(ENUM || (ENUM = {
}));
var ENUM1;
(function(ENUM11) {
    ENUM11[ENUM11["A"] = 0] = "A";
    ENUM11[ENUM11["B"] = 1] = "B";
    ENUM11[ENUM11[""] = 2] = "";
})(ENUM1 || (ENUM1 = {
}));
// enum type var
var ResultIsNumber1 = +ENUM;
var ResultIsNumber2 = +ENUM1;
// enum type expressions
var ResultIsNumber3 = +ENUM1["A"];
var ResultIsNumber4 = +(ENUM[0] + ENUM1["B"]);
// miss assignment operators
+ENUM;
+ENUM1;
+ENUM1.B;
+ENUM, ENUM1;
