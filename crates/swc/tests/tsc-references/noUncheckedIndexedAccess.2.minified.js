//// [noUncheckedIndexedAccess.ts]
!function(NumericEnum1) {
    NumericEnum1[NumericEnum1.A = 0] = "A", NumericEnum1[NumericEnum1.B = 1] = "B", NumericEnum1[NumericEnum1.C = 2] = "C";
}(NumericEnum1 || (NumericEnum1 = {})), function(NumericEnum2) {
    NumericEnum2[NumericEnum2.A = 0] = "A", NumericEnum2[NumericEnum2.B = 1] = "B", NumericEnum2[NumericEnum2.C = 2] = "C";
}(NumericEnum2 || (NumericEnum2 = {})), function(StringEnum1) {
    StringEnum1.A = "Alpha", StringEnum1.B = "Beta";
}(StringEnum1 || (StringEnum1 = {}));
var NumericEnum1, NumericEnum2, StringEnum1, e1 = strMap.foo, e2 = strMap.bar, e3 = strMap[0], e4 = strMap[0], e5 = strMap[0], e6 = strMap[0], e7 = strMap.foo, e8 = strMap[NumericEnum1.A], e9 = strMap[NumericEnum2.A], e10 = strMap[StringEnum1.A], e11 = strMap[StringEnum1.A], e12 = strMap[NumericEnum1.A], e13 = strMap[NumericEnum2.A], e14 = strMap[null], ok1 = strMap.foo, ok2 = strMap.bar;
strMap.baz = void 0, strMap.qua = void 0, strMap[0] = void 0, strMap[null] = void 0;
var num_ok1 = numMap[0], num_ok2 = numMap[0], num_ok3 = numMap[0], num_ok4 = numMap[NumericEnum1.A], num_ok5 = numMap[NumericEnum2.A];
function generic1(arg) {
    return arg.blah;
}
function generic2(arg) {
    return arg.blah;
}
function generic3(arg) {
    return strMap[arg];
}
obj1.x;
var y = "y";
obj1[y];
var yy = "y";
obj1[yy];
var z = "z";
obj1[z];
var f1 = strMapUnion.foo, e15 = symbolMap[s];
symbolMap[s] = void 0;
var variadicOk1 = nonEmptyStringArray[0], variadicError1 = nonEmptyStringArray[1], fn1 = function(key) {
    return myRecord1[key];
}, fn2 = function(key) {
    return myRecord2[key];
}, fn3 = function(key) {
    myRecord2[key] = void 0, myRecord2[key];
};
