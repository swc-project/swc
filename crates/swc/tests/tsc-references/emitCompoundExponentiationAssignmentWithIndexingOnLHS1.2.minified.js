//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS1.ts]
var _prop, _prop1, _prop2, _prop3, _prop4, _prop5, _prop6, array0 = [
    1,
    2,
    3
], i0 = 0;
array0[_prop = ++i0] = Math.pow(array0[_prop], 2);
var array1 = [
    1,
    2,
    3
], i1 = 0;
array1[_prop1 = ++i1] = Math.pow(array1[_prop1], array1[_prop2 = ++i1] = Math.pow(array1[_prop2], 2));
var array2 = [
    1,
    2,
    3
], i2 = 0;
array2[_prop3 = ++i2] = Math.pow(array2[_prop3], Math.pow(array2[++i2], 2));
var array3 = [
    2,
    2,
    3
], j0 = 0, j1 = 1;
array3[_prop4 = j0++] = Math.pow(array3[_prop4], array3[_prop5 = j1++] = Math.pow(array3[_prop5], array3[_prop6 = j0++] = Math.pow(array3[_prop6], 1)));
