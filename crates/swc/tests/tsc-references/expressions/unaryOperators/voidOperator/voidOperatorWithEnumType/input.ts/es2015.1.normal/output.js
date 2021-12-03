var // void  operator on enum type
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
var ResultIsAny1 = void ENUM;
var ResultIsAny2 = void ENUM1;
// enum type expressions
var ResultIsAny3 = void ENUM1["A"];
var ResultIsAny4 = void (ENUM[0] + ENUM1["B"]);
// multiple void  operators
var ResultIsAny5 = void void ENUM;
var ResultIsAny6 = void void void (ENUM[0] + ENUM1.B);
// miss assignment operators
void ENUM;
void ENUM1;
void ENUM1["B"];
ENUM, ENUM1;
