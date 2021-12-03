var // @allowUnusedLabels: true
// typeof  operator on enum type
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
var ResultIsString1 = typeof ENUM;
var ResultIsString2 = typeof ENUM1;
// enum type expressions
var ResultIsString3 = typeof ENUM1["A"];
var ResultIsString4 = typeof (ENUM[0] + ENUM1["B"]);
// multiple typeof  operators
var ResultIsString5 = typeof typeof ENUM;
var ResultIsString6 = typeof typeof typeof (ENUM[0] + ENUM1.B);
// miss assignment operators
typeof ENUM;
typeof ENUM1;
typeof ENUM1["B"];
typeof ENUM, ENUM1;
var // use typeof in type query
z;
(function(z) {
})(z || (z = {
}));
z: typeof ENUM;
z: typeof ENUM1;
