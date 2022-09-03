//// [logicalNotOperatorWithEnumType.ts]
!function(ENUM) {
    ENUM[ENUM.A = 0] = "A", ENUM[ENUM.B = 1] = "B", ENUM[ENUM.C = 2] = "C";
}(ENUM || (ENUM = {})), ENUM1 || (ENUM1 = {});
var ENUM, ENUM1, ResultIsBoolean1 = !ENUM, ResultIsBoolean2 = !ENUM.B, ResultIsBoolean3 = !(ENUM.B + ENUM.C), ResultIsBoolean4 = !!ENUM, ResultIsBoolean5 = !(ENUM.B + ENUM.C);
ENUM.B;
