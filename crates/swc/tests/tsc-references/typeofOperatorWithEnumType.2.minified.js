//// [typeofOperatorWithEnumType.ts]
// typeof  operator on enum type
var ENUM, ENUM1, // use typeof in type query
z, ENUM11;
import { _ as _type_of } from "@swc/helpers/_/_type_of";
ENUM || (ENUM = {}), (ENUM11 = ENUM1 || (ENUM1 = {}))[ENUM11.A = 0] = "A", ENUM11[ENUM11.B = 1] = "B", ENUM11[ENUM11[""] = 2] = "", void 0 === ENUM || _type_of(ENUM), void 0 === ENUM1 || _type_of(ENUM1), _type_of(ENUM1.A), _type_of(ENUM[0] + ENUM1.B), _type_of(void 0 === ENUM ? "undefined" : _type_of(ENUM)), _type_of(_type_of(_type_of(ENUM[0] + ENUM1.B))), // miss assignment operators
void 0 === ENUM || _type_of(ENUM), void 0 === ENUM1 || _type_of(ENUM1), _type_of(ENUM1.B), void 0 === ENUM || _type_of(ENUM), z || (z = {}), void 0 === ENUM || _type_of(ENUM), void 0 === ENUM1 || _type_of(ENUM1);
