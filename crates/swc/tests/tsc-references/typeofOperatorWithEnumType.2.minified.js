//// [typeofOperatorWithEnumType.ts]
import { _ as _type_of } from "@swc/helpers/_/_type_of";
var ENUM1, ENUM = ENUM || {}, ENUM11 = ((ENUM1 = ENUM11 || {})[ENUM1.A = 0] = "A", ENUM1[ENUM1.B = 1] = "B", ENUM1[ENUM1[""] = 2] = "", ENUM1);
void 0 === ENUM || _type_of(ENUM), void 0 === ENUM11 || _type_of(ENUM11), _type_of(0), _type_of(ENUM[0] + 1), _type_of(void 0 === ENUM ? "undefined" : _type_of(ENUM)), _type_of(_type_of(_type_of(ENUM[0] + 1))), void 0 === ENUM || _type_of(ENUM), void 0 === ENUM11 || _type_of(ENUM11), _type_of(1), void 0 === ENUM || _type_of(ENUM), void 0 === ENUM || _type_of(ENUM), void 0 === ENUM11 || _type_of(ENUM11);
