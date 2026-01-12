//// [decrementOperatorWithEnumType.ts]
// -- operator on enum type
var ENUM1 = /*#__PURE__*/ function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
    return ENUM1;
}(ENUM1 || {});
;
// expression
var ResultIsNumber1 = --0;
var ResultIsNumber2 = 0--;
// miss assignment operator
--0;
ENUM1[A]--;
