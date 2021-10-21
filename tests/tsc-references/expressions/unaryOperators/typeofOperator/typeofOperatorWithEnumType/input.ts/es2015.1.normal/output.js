var // @allowUnusedLabels: true
// typeof  operator on enum type
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
var ResultIsString1 = typeof ENUM;
var ResultIsString2 = typeof ENUM11;
// enum type expressions
var ResultIsString3 = typeof ENUM11["A"];
var ResultIsString4 = typeof (ENUM[0] + ENUM11["B"]);
// multiple typeof  operators
var ResultIsString5 = typeof typeof ENUM;
var ResultIsString6 = typeof typeof typeof (ENUM[0] + ENUM11.B);
// miss assignment operators
typeof ENUM;
typeof ENUM11;
typeof ENUM11["B"];
typeof ENUM, ENUM11;
var // use typeof in type query
z;
(function(z) {
})(z || (z = {
}));
z: typeof ENUM;
z: typeof ENUM11;
