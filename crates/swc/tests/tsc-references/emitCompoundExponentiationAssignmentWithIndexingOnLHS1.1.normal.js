//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS1.ts]
var array0 = [
    1,
    2,
    3
];
var i0 = 0;
_prop = ++i0, array0[_prop] = Math.pow(array0[_prop], 2);
var array1 = [
    1,
    2,
    3
];
var i1 = 0;
_prop = ++i1, array1[_prop] = Math.pow(array1[_prop], (_prop = ++i1, array1[_prop] = Math.pow(array1[_prop], 2)));
var array2 = [
    1,
    2,
    3
];
var i2 = 0;
_prop = ++i2, array2[_prop] = Math.pow(array2[_prop], Math.pow(array2[++i2], 2));
var array3 = [
    2,
    2,
    3
];
var j0 = 0, j1 = 1;
var _$_prop;
var _$_prop1;
var _$_prop2;
_$_prop = j0++, array3[_$_prop] = Math.pow(array3[_$_prop], (_$_prop1 = j1++, array3[_$_prop1] = Math.pow(array3[_$_prop1], (_$_prop2 = j0++, array3[_$_prop2] = Math.pow(array3[_$_prop2], 1)))));
