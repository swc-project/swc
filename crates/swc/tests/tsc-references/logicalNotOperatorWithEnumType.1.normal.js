//// [logicalNotOperatorWithEnumType.ts]
// ! operator on enum type
var ENUM = /*#__PURE__*/ function(ENUM) {
    ENUM[ENUM["A"] = 0] = "A";
    ENUM[ENUM["B"] = 1] = "B";
    ENUM[ENUM["C"] = 2] = "C";
    return ENUM;
}(ENUM || {});
;
var ENUM1 = /*#__PURE__*/ function(ENUM1) {
    return ENUM1;
}(ENUM1 || {});
;
// enum type var
var ResultIsBoolean1 = !ENUM;
// enum type expressions
var ResultIsBoolean2 = !ENUM["B"];
var ResultIsBoolean3 = !(ENUM.B + ENUM["C"]);
// multiple ! operators
var ResultIsBoolean4 = !!ENUM;
var ResultIsBoolean5 = !!!(ENUM["B"] + ENUM.C);
// miss assignment operators
!ENUM;
!ENUM1;
!ENUM.B;
!ENUM, ENUM1;
