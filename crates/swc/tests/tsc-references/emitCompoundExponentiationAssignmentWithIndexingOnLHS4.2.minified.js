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
array1[incrementIdx(array1.length)] = Math.pow(array1[incrementIdx(array1.length)], 3);
var ref1 = array1[incrementIdx(array1.length)];
array1[incrementIdx(array1.length)] = Math.pow(array1[incrementIdx(array1.length)], array1[incrementIdx(array1.length)] = Math.pow(ref1, 2)), array1[incrementIdx(array1.length)] = Math.pow(array1[incrementIdx(array1.length)], Math.pow(array1[incrementIdx(array1.length)], 2));
