//// [logicalNotOperatorWithEnumType.ts]
// ! operator on enum type
var ENUM;
(function(ENUM) {
    ENUM[ENUM["A"] = 0] = "A";
    ENUM[ENUM["B"] = 1] = "B";
    ENUM[ENUM["C"] = 2] = "C";
})(ENUM || (ENUM = {}));
var ENUM1;
(function(ENUM1) {})(ENUM1 || (ENUM1 = {}));
// enum type var
var ResultIsBoolean1 = !ENUM;
// enum type expressions
var ResultIsBoolean2 = !1;
var ResultIsBoolean3 = !(1 + 2);
// multiple ! operators
var ResultIsBoolean4 = !!ENUM;
var ResultIsBoolean5 = !!!(1 + 2);
// miss assignment operators
!ENUM;
!ENUM1;
!1;
!ENUM, ENUM1;
