var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
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
var ResultIsString1 = typeof ENUM === "undefined" ? "undefined" : _typeof(ENUM);
var ResultIsString2 = typeof ENUM11 === "undefined" ? "undefined" : _typeof(ENUM11);
// enum type expressions
var ResultIsString3 = _typeof(ENUM11["A"]);
var ResultIsString4 = _typeof(ENUM[0] + ENUM11["B"]);
// multiple typeof  operators
var ResultIsString5 = _typeof(typeof ENUM === "undefined" ? "undefined" : _typeof(ENUM));
var ResultIsString6 = _typeof(_typeof(_typeof(ENUM[0] + ENUM11.B)));
// miss assignment operators
typeof ENUM === "undefined" ? "undefined" : _typeof(ENUM);
typeof ENUM11 === "undefined" ? "undefined" : _typeof(ENUM11);
_typeof(ENUM11["B"]);
typeof ENUM === "undefined" ? "undefined" : _typeof(ENUM), ENUM11;
var // use typeof in type query
z;
(function(z) {
})(z || (z = {
}));
z: typeof ENUM === "undefined" ? "undefined" : _typeof(ENUM);
z: typeof ENUM11 === "undefined" ? "undefined" : _typeof(ENUM11);
