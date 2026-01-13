//// [voidOperatorWithEnumType.ts]
// void  operator on enum type
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
var ResultIsAny1 = void ENUM;
var ResultIsAny2 = void ENUM1;
// enum type expressions
var ResultIsAny3 = void 0;
var ResultIsAny4 = void (ENUM[0] + 1);
// multiple void  operators
var ResultIsAny5 = void void ENUM;
var ResultIsAny6 = void void void (ENUM[0] + 1);
// miss assignment operators
void ENUM;
void ENUM1;
void 1;
ENUM, ENUM1;
