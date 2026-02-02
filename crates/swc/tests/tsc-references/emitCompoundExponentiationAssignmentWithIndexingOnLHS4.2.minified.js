//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS4.ts]
var _prop, _prop1, _prop2, _prop3, globalCounter = 0;
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
_prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], 3), _prop1 = incrementIdx(array1.length), array1[_prop1] = Math.pow(array1[_prop1], (_prop2 = incrementIdx(array1.length), array1[_prop2] = Math.pow(array1[_prop2], 2))), _prop3 = incrementIdx(array1.length), array1[_prop3] = Math.pow(array1[_prop3], Math.pow(array1[incrementIdx(array1.length)], 2));
