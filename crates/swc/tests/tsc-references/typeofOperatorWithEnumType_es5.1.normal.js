import _type_of from "@swc/helpers/lib/_type_of.js";
var // @allowUnusedLabels: true
// typeof  operator on enum type
ENUM;
(function(ENUM) {})(ENUM || (ENUM = {}));
var ENUM1;
(function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
})(ENUM1 || (ENUM1 = {}));
// enum type var
var ResultIsString1 = typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM);
var ResultIsString2 = typeof ENUM1 === "undefined" ? "undefined" : _type_of(ENUM1);
// enum type expressions
var ResultIsString3 = _type_of(ENUM1["A"]);
var ResultIsString4 = _type_of(ENUM[0] + ENUM1["B"]);
// multiple typeof  operators
var ResultIsString5 = _type_of(typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM));
var ResultIsString6 = _type_of(_type_of(_type_of(ENUM[0] + ENUM1.B)));
// miss assignment operators
typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM);
typeof ENUM1 === "undefined" ? "undefined" : _type_of(ENUM1);
_type_of(ENUM1["B"]);
typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM), ENUM1;
var // use typeof in type query
z;
(function(z) {})(z || (z = {}));
z: typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM);
z: typeof ENUM1 === "undefined" ? "undefined" : _type_of(ENUM1);
