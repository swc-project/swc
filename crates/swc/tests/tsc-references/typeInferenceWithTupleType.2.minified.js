//// [typeInferenceWithTupleType.ts]
var zipResult = function(array1, array2) {
    if (array1.length != array2.length) return [
        [
            void 0,
            void 0
        ]
    ];
    for(var length = array1.length, i = 0; i < length; ++i)(void 0).push([
        array1[i],
        array2[i]
    ]);
}([
    "foo",
    "bar"
], [
    5,
    6
]);
zipResult[0], zipResult[0][0], f1(void 0), f2(void 0);
