//// [incrementOperatorWithEnumType.ts]
var ENUM1, ENUM11;
(ENUM11 = ENUM1 = {})[ENUM11.A = 0] = "A", ENUM11[ENUM11.B = 1] = "B", ENUM11[ENUM11[""] = 2] = "", ++ENUM1.B, ENUM1.B++, ++ENUM1.B, ENUM1.B++;
