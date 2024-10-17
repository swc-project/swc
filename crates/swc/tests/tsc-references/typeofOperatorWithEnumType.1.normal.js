//// [typeofOperatorWithEnumType.ts]
// typeof  operator on enum type
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var ENUM = /*#__PURE__*/ function(ENUM) {
    return ENUM;
}(ENUM || {});
var ENUM1 = /*#__PURE__*/ function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
    return ENUM1;
}(ENUM1 || {});
// enum type var
var ResultIsString1 = typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM);
var ResultIsString2 = typeof ENUM1 === "undefined" ? "undefined" : _type_of(ENUM1);
// enum type expressions
var ResultIsString3 = _type_of(0);
var ResultIsString4 = _type_of(ENUM[0] + 1);
// multiple typeof  operators
var ResultIsString5 = _type_of(typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM));
var ResultIsString6 = _type_of(_type_of(_type_of(ENUM[0] + 1)));
// miss assignment operators
typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM);
typeof ENUM1 === "undefined" ? "undefined" : _type_of(ENUM1);
_type_of(1);
typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM), ENUM1;
// use typeof in type query
var z = /*#__PURE__*/ function(z) {
    return z;
}(z || {});
z: typeof ENUM === "undefined" ? "undefined" : _type_of(ENUM);
z: typeof ENUM1 === "undefined" ? "undefined" : _type_of(ENUM1);
