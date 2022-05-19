var NumericEnum1;
(function(NumericEnum1) {
    NumericEnum1[NumericEnum1["A"] = 0] = "A";
    NumericEnum1[NumericEnum1["B"] = 1] = "B";
    NumericEnum1[NumericEnum1["C"] = 2] = "C";
})(NumericEnum1 || (NumericEnum1 = {}));
var NumericEnum2;
(function(NumericEnum2) {
    NumericEnum2[NumericEnum2["A"] = 0] = "A";
    NumericEnum2[NumericEnum2["B"] = 1] = "B";
    NumericEnum2[NumericEnum2["C"] = 2] = "C";
})(NumericEnum2 || (NumericEnum2 = {}));
var StringEnum1;
(function(StringEnum1) {
    StringEnum1["A"] = "Alpha";
    StringEnum1["B"] = "Beta";
})(StringEnum1 || (StringEnum1 = {}));
// All of these should be errors
const e1 = strMap["foo"];
const e2 = strMap.bar;
const e3 = strMap[0];
const e4 = strMap[0];
const e5 = strMap[0];
const e6 = strMap[0];
const e7 = strMap["foo"];
const e8 = strMap[NumericEnum1.A];
const e9 = strMap[NumericEnum2.A];
const e10 = strMap[StringEnum1.A];
const e11 = strMap[StringEnum1.A];
const e12 = strMap[NumericEnum1.A];
const e13 = strMap[NumericEnum2.A];
const e14 = strMap[null];
// Should be OK
const ok1 = strMap["foo"];
const ok2 = strMap.bar;
// Writes don't allow 'undefined'; all should be errors
strMap["baz"] = undefined;
strMap.qua = undefined;
strMap[0] = undefined;
strMap[null] = undefined;
// All of these should be ok
const num_ok1 = numMap[0];
const num_ok2 = numMap[0];
const num_ok3 = numMap[0];
const num_ok4 = numMap[NumericEnum1.A];
const num_ok5 = numMap[NumericEnum2.A];
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
const y = "y";
obj1[y];
let yy = "y";
obj1[yy];
let z = "z";
obj1[z];
// Should error
const f1 = strMapUnion["foo"];
const e15 = symbolMap[s]; // Should OK
symbolMap[s] = undefined; // Should error
const variadicOk1 = nonEmptyStringArray[0]; // Should OK
const variadicError1 = nonEmptyStringArray[1]; // Should error
const fn1 = (key)=>myRecord1[key]; // Should OK
const fn2 = (key)=>myRecord2[key]; // Should OK
const fn3 = (key)=>{
    myRecord2[key] = undefined; // Should error
    const v = myRecord2[key]; // Should error
};
