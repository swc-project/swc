//// [typeofOperatorWithEnumType.ts]
import _type_of from "@swc/helpers/src/_type_of.mjs";
ENUM || (ENUM = {}), function(ENUM1) {
    ENUM1[ENUM1.A = 0] = "A", ENUM1[ENUM1.B = 1] = "B", ENUM1[ENUM1[""] = 2] = "";
}(ENUM1 || (ENUM1 = {}));
var ENUM, ENUM1, z, ResultIsString1 = void 0 === ENUM ? "undefined" : _type_of(ENUM), ResultIsString2 = void 0 === ENUM1 ? "undefined" : _type_of(ENUM1), ResultIsString3 = _type_of(ENUM1.A), ResultIsString4 = _type_of(ENUM[0] + ENUM1.B), ResultIsString5 = _type_of(void 0 === ENUM ? "undefined" : _type_of(ENUM)), ResultIsString6 = _type_of(_type_of(_type_of(ENUM[0] + ENUM1.B)));
void 0 === ENUM || _type_of(ENUM), void 0 === ENUM1 || _type_of(ENUM1), _type_of(ENUM1.B), void 0 === ENUM || _type_of(ENUM), z || (z = {});
z: void 0 === ENUM || _type_of(ENUM);
z: void 0 === ENUM1 || _type_of(ENUM1);
