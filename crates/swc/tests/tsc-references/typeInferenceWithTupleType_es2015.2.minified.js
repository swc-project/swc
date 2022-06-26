var combineResult = [
    "string",
    10
];
combineResult[0], combineResult[1];
var zipResult = function(array1, array2) {
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
}([
    "foo",
    "bar"
], [
    5,
    6
]);
zipResult[0], zipResult[0][0], f1(void 0), f2(void 0);
