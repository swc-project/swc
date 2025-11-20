//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS4.ts]
var globalCounter = 0;
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
_prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], 3), _prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], (_prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], 2))), _prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], Math.pow(array1[incrementIdx(array1.length)], 2));
