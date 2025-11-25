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
_prop = incrementIdx(array1.length), array1[_prop] = Math.pow(array1[_prop], 3);
var _$_prop;
var _$_prop1;
_$_prop = incrementIdx(array1.length), array1[_$_prop] = Math.pow(array1[_$_prop], (_$_prop1 = incrementIdx(array1.length), array1[_$_prop1] = Math.pow(array1[_$_prop1], 2)));
var _$_prop2;
_$_prop2 = incrementIdx(array1.length), array1[_$_prop2] = Math.pow(array1[_$_prop2], Math.pow(array1[incrementIdx(array1.length)], 2));
