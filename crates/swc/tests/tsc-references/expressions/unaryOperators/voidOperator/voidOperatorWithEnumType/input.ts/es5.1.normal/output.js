var // void  operator on enum type
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
var ResultIsAny1 = void ENUM;
var ResultIsAny2 = void ENUM11;
// enum type expressions
var ResultIsAny3 = void ENUM11["A"];
var ResultIsAny4 = void (ENUM[0] + ENUM11["B"]);
// multiple void  operators
var ResultIsAny5 = void void ENUM;
var ResultIsAny6 = void void void (ENUM[0] + ENUM11.B);
// miss assignment operators
void ENUM;
void ENUM11;
void ENUM11["B"];
ENUM, ENUM11;
