//// [plusOperatorWithEnumType.ts]
ENUM || (ENUM = {}), function(ENUM1) {
    ENUM1[ENUM1.A = 0] = "A", ENUM1[ENUM1.B = 1] = "B", ENUM1[ENUM1[""] = 2] = "";
}(ENUM1 || (ENUM1 = {}));
var ENUM, ENUM1, ResultIsNumber1 = +ENUM, ResultIsNumber2 = +ENUM1, ResultIsNumber3 = +ENUM1.A, ResultIsNumber4 = +(ENUM[0] + ENUM1.B);
ENUM1.B;
