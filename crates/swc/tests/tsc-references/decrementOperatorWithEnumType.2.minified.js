//// [decrementOperatorWithEnumType.ts]
var ENUM1, ENUM11 = ((ENUM1 = ENUM11 || {})[ENUM1.A = 0] = "A", ENUM1[ENUM1.B = 1] = "B", ENUM1[ENUM1[""] = 2] = "", ENUM1);
--ENUM11.A, ENUM11.A--, --ENUM11.A, ENUM11[A]--;
