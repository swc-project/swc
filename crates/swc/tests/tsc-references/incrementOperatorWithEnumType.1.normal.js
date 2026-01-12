//// [incrementOperatorWithEnumType.ts]
// ++ operator on enum type
var ENUM1 = /*#__PURE__*/ function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
    return ENUM1;
}(ENUM1 || {});
;
// expression
var ResultIsNumber1 = ++1;
var ResultIsNumber2 = 1++;
// miss assignment operator
++1;
1++;
