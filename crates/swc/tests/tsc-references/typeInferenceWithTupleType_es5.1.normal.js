function combine(x, y) {
    return [
        x,
        y
    ];
}
var combineResult = combine("string", 10);
var combineEle1 = combineResult[0]; // string
var combineEle2 = combineResult[1]; // number
function zip(array1, array2) {
    if (array1.length != array2.length) {
        return [
            [
                undefined,
                undefined
            ]
        ];
    }
    var length = array1.length;
    var zipResult;
    for(var i = 0; i < length; ++i){
        zipResult.push([
            array1[i],
            array2[i]
        ]);
    }
    return zipResult;
}
var zipResult = zip([
    "foo",
    "bar"
], [
    5,
    6
]);
var zipResultEle = zipResult[0]; // [string, number]
var zipResultEleEle = zipResult[0][0]; // string
var expected;
expected = f1(undefined);
expected = f2(undefined);
