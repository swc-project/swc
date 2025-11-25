//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS1.ts]
var array0 = [
    1,
    2,
    3
];
var i0 = 0;
var _prop;
_prop = ++i0, array0[_prop] = Math.pow(array0[_prop], 2);
var array1 = [
    1,
    2,
    3
];
var i1 = 0;
var _prop1;
var _prop2;
_prop1 = ++i1, array1[_prop1] = Math.pow(array1[_prop1], (_prop2 = ++i1, array1[_prop2] = Math.pow(array1[_prop2], 2)));
var array2 = [
    1,
    2,
    3
];
var i2 = 0;
var _prop3;
_prop3 = ++i2, array2[_prop3] = Math.pow(array2[_prop3], Math.pow(array2[++i2], 2));
var array3 = [
    2,
    2,
    3
];
var j0 = 0, j1 = 1;
var _prop4;
var _prop5;
var _prop6;
_prop4 = j0++, array3[_prop4] = Math.pow(array3[_prop4], (_prop5 = j1++, array3[_prop5] = Math.pow(array3[_prop5], (_prop6 = j0++, array3[_prop6] = Math.pow(array3[_prop6], 1)))));
