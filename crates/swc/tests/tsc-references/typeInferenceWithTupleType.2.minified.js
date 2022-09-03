//// [typeInferenceWithTupleType.ts]
function combine(x, y) {
    return [
        x,
        y
    ];
}
var expected, combineResult = combine("string", 10), combineEle1 = combineResult[0], combineEle2 = combineResult[1];
function zip(array1, array2) {
    if (array1.length != array2.length) return [
        [
            void 0,
            void 0
        ]
    ];
    for(var zipResult, length = array1.length, i = 0; i < length; ++i)zipResult.push([
        array1[i],
        array2[i]
    ]);
    return zipResult;
}
var zipResult = zip([
    "foo",
    "bar"
], [
    5,
    6
]), zipResultEle = zipResult[0], zipResultEleEle = zipResult[0][0];
expected = f1(void 0), expected = f2(void 0);
