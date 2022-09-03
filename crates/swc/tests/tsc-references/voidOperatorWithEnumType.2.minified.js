//// [voidOperatorWithEnumType.ts]
ENUM || (ENUM = {}), function(ENUM1) {
    ENUM1[ENUM1.A = 0] = "A", ENUM1[ENUM1.B = 1] = "B", ENUM1[ENUM1[""] = 2] = "";
}(ENUM1 || (ENUM1 = {}));
var ENUM, ENUM1, ResultIsAny1 = void 0, ResultIsAny2 = void 0, ResultIsAny3 = void ENUM1.A, ResultIsAny4 = void (ENUM[0] + ENUM1.B), ResultIsAny5 = void 0, ResultIsAny6 = void (ENUM[0] + ENUM1.B);
ENUM1.B;
