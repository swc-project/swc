//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS1.ts]
var array0 = [
    1,
    2,
    3
];
var i0 = 0;
var ref = array0[++i0];
array0[++i0] = Math.pow(ref, 2);
var array1 = [
    1,
    2,
    3
];
var i1 = 0;
var ref1 = array1[++i1], ref2 = array1[++i1];
array1[++i1] = Math.pow(ref2, array1[++i1] = Math.pow(ref1, 2));
var array2 = [
    1,
    2,
    3
];
var i2 = 0;
var ref3 = array2[++i2];
array2[++i2] = Math.pow(ref3, Math.pow(array2[++i2], 2));
var array3 = [
    2,
    2,
    3
];
var j0 = 0, j1 = 1;
var ref4 = array3[j0++], ref5 = array3[j1++], ref6 = array3[j0++];
array3[j0++] = Math.pow(ref6, array3[j1++] = Math.pow(ref5, array3[j0++] = Math.pow(ref4, 1)));
