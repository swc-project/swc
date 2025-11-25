//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS1.ts]
var _$_prop, _$_prop1, _$_prop2, array0 = [
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
array1[_prop = ++i1] = Math.pow(array1[_prop], array1[_prop = ++i1] = Math.pow(array1[_prop], 2));
var array2 = [
    1,
    2,
    3
], i2 = 0;
array2[_prop = ++i2] = Math.pow(array2[_prop], Math.pow(array2[++i2], 2));
var array3 = [
    2,
    2,
    3
], j0 = 0, j1 = 1;
array3[_$_prop = j0++] = Math.pow(array3[_$_prop], array3[_$_prop1 = j1++] = Math.pow(array3[_$_prop1], array3[_$_prop2 = j0++] = Math.pow(array3[_$_prop2], 1)));
