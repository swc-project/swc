//// [emitCompoundExponentiationAssignmentWithIndexingOnLHS4.ts]
var globalCounter = 0;
function incrementIdx(max) {
    globalCounter += 1;
    var idx = Math.floor(Math.random() * max);
    return idx;
}
var array1 = [
    1,
    2,
    3,
    4,
    5
];
var _prop;
_prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], 3);
var _prop1;
var _prop2;
_prop1 = incrementIdx(array1.length), array1[_prop1] = Math.pow(array1[_prop1], (_prop2 = incrementIdx(array1.length), array1[_prop2] = Math.pow(array1[_prop2], 2)));
var _prop3;
_prop3 = incrementIdx(array1.length), array1[_prop3] = Math.pow(array1[_prop3], Math.pow(array1[incrementIdx(array1.length)], 2));
