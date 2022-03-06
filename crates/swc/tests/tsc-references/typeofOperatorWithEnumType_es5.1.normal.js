import * as swcHelpers from "@swc/helpers";
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
var ResultIsString1 = typeof ENUM === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM);
var ResultIsString2 = typeof ENUM1 === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM1);
// enum type expressions
var ResultIsString3 = swcHelpers.typeOf(ENUM1["A"]);
var ResultIsString4 = swcHelpers.typeOf(ENUM[0] + ENUM1["B"]);
// multiple typeof  operators
var ResultIsString5 = swcHelpers.typeOf(typeof ENUM === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM));
var ResultIsString6 = swcHelpers.typeOf(swcHelpers.typeOf(swcHelpers.typeOf(ENUM[0] + ENUM1.B)));
// miss assignment operators
typeof ENUM === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM);
typeof ENUM1 === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM1);
swcHelpers.typeOf(ENUM1["B"]);
typeof ENUM === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM), ENUM1;
var // use typeof in type query
z;
(function(z) {})(z || (z = {}));
z: typeof ENUM === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM);
z: typeof ENUM1 === "undefined" ? "undefined" : swcHelpers.typeOf(ENUM1);
