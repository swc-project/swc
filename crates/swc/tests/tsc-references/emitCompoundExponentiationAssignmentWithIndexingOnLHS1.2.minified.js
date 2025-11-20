//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS1.ts]
var array0 = [
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
array3[_prop = j0++] = Math.pow(array3[_prop], array3[_prop = j1++] = Math.pow(array3[_prop], array3[_prop = j0++] = Math.pow(array3[_prop], 1)));
