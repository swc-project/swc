//// [plusOperatorWithEnumType.ts]
// + operator on enum type
var ENUM;
(function(ENUM) {})(ENUM || (ENUM = {}));
var ENUM1;
(function(ENUM1) {
    ENUM1[ENUM1["A"] = 0] = "A";
    ENUM1[ENUM1["B"] = 1] = "B";
    ENUM1[ENUM1[""] = 2] = "";
})(ENUM1 || (ENUM1 = {}));
// enum type var
var ResultIsNumber1 = +ENUM;
var ResultIsNumber2 = +ENUM1;
// enum type expressions
var ResultIsNumber3 = +0;
var ResultIsNumber4 = +(ENUM[0] + 1);
// miss assignment operators
+ENUM;
+ENUM1;
+1;
+ENUM, ENUM1;
