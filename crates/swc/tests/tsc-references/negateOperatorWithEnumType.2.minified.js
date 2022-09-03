//// [negateOperatorWithEnumType.ts]
ENUM || (ENUM = {}), function(ENUM1) {
    ENUM1[ENUM1.A = 0] = "A", ENUM1[ENUM1.B = 1] = "B", ENUM1[ENUM1[""] = 2] = "";
}(ENUM1 || (ENUM1 = {}));
var ENUM, ENUM1, ResultIsNumber1 = -ENUM, ResultIsNumber2 = -ENUM1.B, ResultIsNumber3 = -(ENUM1.B + ENUM1[""]);
ENUM1.B;
