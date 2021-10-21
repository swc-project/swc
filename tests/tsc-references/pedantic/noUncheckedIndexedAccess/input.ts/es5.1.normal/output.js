var NumericEnum11;
(function(NumericEnum1) {
    NumericEnum1[NumericEnum1["A"] = 0] = "A";
    NumericEnum1[NumericEnum1["B"] = 1] = "B";
    NumericEnum1[NumericEnum1["C"] = 2] = "C";
})(NumericEnum11 || (NumericEnum11 = {
}));
var NumericEnum21;
(function(NumericEnum2) {
    NumericEnum2[NumericEnum2["A"] = 0] = "A";
    NumericEnum2[NumericEnum2["B"] = 1] = "B";
    NumericEnum2[NumericEnum2["C"] = 2] = "C";
})(NumericEnum21 || (NumericEnum21 = {
}));
var StringEnum11;
(function(StringEnum1) {
    StringEnum1["A"] = "Alpha";
    StringEnum1["B"] = "Beta";
})(StringEnum11 || (StringEnum11 = {
}));
// All of these should be errors
var e1 = strMap["foo"];
var e2 = strMap.bar;
var e3 = strMap[0];
var e4 = strMap[0];
var e5 = strMap[0];
var e6 = strMap[0];
var e7 = strMap["foo"];
var e8 = strMap[NumericEnum11.A];
var e9 = strMap[NumericEnum21.A];
var e10 = strMap[StringEnum11.A];
var e11 = strMap[StringEnum11.A];
var e12 = strMap[NumericEnum11.A];
var e13 = strMap[NumericEnum21.A];
var e14 = strMap[null];
// Should be OK
var ok1 = strMap["foo"];
var ok2 = strMap.bar;
// Writes don't allow 'undefined'; all should be errors
strMap["baz"] = undefined;
strMap.qua = undefined;
strMap[0] = undefined;
strMap[null] = undefined;
// All of these should be ok
var num_ok1 = numMap[0];
var num_ok2 = numMap[0];
var num_ok3 = numMap[0];
var num_ok4 = numMap[NumericEnum11.A];
var num_ok5 = numMap[NumericEnum21.A];
// Generics
function generic1(arg) {
    // Should error
    return arg["blah"];
}
function generic2(arg) {
    // Should OK
    return arg["blah"];
}
function generic3(arg) {
    // Should error
    return strMap[arg];
}
obj1["x"];
var y = "y";
obj1[y];
var yy = "y";
obj1[yy];
var z = "z";
obj1[z];
// Should error
var f1 = strMapUnion["foo"];
var e15 = symbolMap[s]; // Should OK
symbolMap[s] = undefined; // Should error
var variadicOk1 = nonEmptyStringArray[0]; // Should OK
var variadicError1 = nonEmptyStringArray[1]; // Should error
var fn1 = function(key) {
    return myRecord1[key];
}; // Should OK
var fn2 = function(key) {
    return myRecord2[key];
}; // Should OK
var fn3 = function(key) {
    myRecord2[key] = undefined; // Should error
    var v = myRecord2[key]; // Should error
};
