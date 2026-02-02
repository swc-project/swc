//// [deleteOperatorWithEnumType.ts]
// delete  operator on enum type
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
var ResultIsBoolean1 = delete ENUM;
var ResultIsBoolean2 = delete ENUM1;
// enum type expressions
var ResultIsBoolean3 = delete 0;
var ResultIsBoolean4 = delete (ENUM[0] + 1);
// multiple delete  operators
var ResultIsBoolean5 = delete delete ENUM;
var ResultIsBoolean6 = delete delete delete (ENUM[0] + 1);
// miss assignment operators
delete ENUM;
delete ENUM1;
delete 1;
delete ENUM, ENUM1;
