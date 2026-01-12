//// [negateOperatorWithEnumType.ts]
// - operator on enum type
var ENUM = /*#__PURE__*/ function(ENUM) {
    return ENUM;
}(ENUM || {});
var ENUM1 = /*#__PURE__*/ function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
    return ENUM1;
}(ENUM1 || {});
// enum type var
var ResultIsNumber1 = -ENUM;
// expressions
var ResultIsNumber2 = -1;
var ResultIsNumber3 = -(1 + 2);
// miss assignment operators
-ENUM;
-ENUM1;
-1;
-ENUM, ENUM1;
