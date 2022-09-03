//// [decrementOperatorWithEnumType.ts]
!function(ENUM1) {
    ENUM1[ENUM1.A = 0] = "A", ENUM1[ENUM1.B = 1] = "B", ENUM1[ENUM1[""] = 2] = "";
}(ENUM1 || (ENUM1 = {}));
var ENUM1, ResultIsNumber1 = --ENUM1.A, ResultIsNumber2 = ENUM1.A--;
--ENUM1.A, ENUM1[A]--;
