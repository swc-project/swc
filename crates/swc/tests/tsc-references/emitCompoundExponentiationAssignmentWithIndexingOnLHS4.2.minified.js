//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS4.ts]
var _$_prop, _$_prop1, _$_prop2, globalCounter = 0;
function incrementIdx(max) {
    return globalCounter += 1, Math.floor(Math.random() * max);
}
var array1 = [
    1,
    2,
    3,
    4,
    5
];
_prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], 3), _$_prop = incrementIdx(array1.length), array1[_$_prop] = Math.pow(array1[_$_prop], (_$_prop1 = incrementIdx(array1.length), array1[_$_prop1] = Math.pow(array1[_$_prop1], 2))), _$_prop2 = incrementIdx(array1.length), array1[_$_prop2] = Math.pow(array1[_$_prop2], Math.pow(array1[incrementIdx(array1.length)], 2));
