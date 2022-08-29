//// [noUncheckedIndexedAccess.ts]
var NumericEnum1, NumericEnum2, StringEnum1;
!function(NumericEnum1) {
    NumericEnum1[NumericEnum1.A = 0] = "A", NumericEnum1[NumericEnum1.B = 1] = "B", NumericEnum1[NumericEnum1.C = 2] = "C";
}(NumericEnum1 || (NumericEnum1 = {})), function(NumericEnum2) {
    NumericEnum2[NumericEnum2.A = 0] = "A", NumericEnum2[NumericEnum2.B = 1] = "B", NumericEnum2[NumericEnum2.C = 2] = "C";
}(NumericEnum2 || (NumericEnum2 = {})), function(StringEnum1) {
    StringEnum1.A = "Alpha", StringEnum1.B = "Beta";
}(StringEnum1 || (StringEnum1 = {})), strMap.foo, strMap.bar, strMap[0], strMap[0], strMap[0], strMap[0], strMap.foo, strMap[NumericEnum1.A], strMap[NumericEnum2.A], strMap[StringEnum1.A], strMap[StringEnum1.A], strMap[NumericEnum1.A], strMap[NumericEnum2.A], strMap[null], strMap.foo, strMap.bar, strMap.baz = void 0, strMap.qua = void 0, strMap[0] = void 0, strMap[null] = void 0, numMap[0], numMap[0], numMap[0], numMap[NumericEnum1.A], numMap[NumericEnum2.A], obj1.x, obj1.y, obj1.y, obj1.z, strMapUnion.foo, symbolMap[s], symbolMap[s] = void 0, nonEmptyStringArray[0], nonEmptyStringArray[1];
