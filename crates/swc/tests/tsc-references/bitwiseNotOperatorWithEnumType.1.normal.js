//// [bitwiseNotOperatorWithEnumType.ts]
// ~ operator on enum type
var ENUM1 = /*#__PURE__*/ function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
    return ENUM1;
}(ENUM1 || {});
// enum type var
var ResultIsNumber1 = ~ENUM1;
// enum type expressions
var ResultIsNumber2 = ~0;
var ResultIsNumber3 = ~(0 + 1);
// multiple ~ operators
var ResultIsNumber4 = ~~~(0 + 1);
// miss assignment operators
~ENUM1;
~0;
~0, ~1;
