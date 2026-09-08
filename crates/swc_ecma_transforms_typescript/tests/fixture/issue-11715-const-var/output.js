const s = "aThisIs";
const n = 1;
const concat = "a" + "b";
const chain = s;
var StringEnum = /*#__PURE__*/ function(StringEnum) {
    StringEnum["A"] = "aThisIs";
    StringEnum["B"] = "bThisIs";
    return StringEnum;
}(StringEnum || {});
var NumericAutoIncrement = /*#__PURE__*/ function(NumericAutoIncrement) {
    NumericAutoIncrement[NumericAutoIncrement["A"] = 1] = "A";
    NumericAutoIncrement[NumericAutoIncrement["B"] = 2] = "B";
    NumericAutoIncrement[NumericAutoIncrement["C"] = 3] = "C";
    return NumericAutoIncrement;
}(NumericAutoIncrement || {});
var ConstantExpr = /*#__PURE__*/ function(ConstantExpr) {
    ConstantExpr["A"] = "ab";
    ConstantExpr["B"] = "aThisIs";
    return ConstantExpr;
}(ConstantExpr || {});
