//// [decrementOperatorWithEnumType.ts]
// -- operator on enum type
var ENUM1, ENUM11;
(ENUM11 = ENUM1 || (ENUM1 = {}))[ENUM11.A = 0] = "A", ENUM11[ENUM11.B = 1] = "B", ENUM11[ENUM11[""] = 2] = "", --ENUM1.A, ENUM1.A--, // miss assignment operator
--ENUM1.A, ENUM1[A]--;
