//// [indexerWithTuple.ts]
var strNumTuple = [
    "foo",
    10
], numTupleTuple = [
    10,
    [
        "bar",
        20
    ]
], unionTuple1 = [
    10,
    "foo"
], unionTuple2 = [
    !0,
    "foo"
];
strNumTuple[0], strNumTuple[1], strNumTuple[2], strNumTuple[0], strNumTuple[1], strNumTuple["0"], strNumTuple["1"], numTupleTuple[1], numTupleTuple[2], strNumTuple[-1], unionTuple1[0], unionTuple1[1], unionTuple1[2], unionTuple1[0], unionTuple1[1], unionTuple1["0"], unionTuple1["1"], unionTuple2[0], unionTuple2[1], unionTuple2[2], unionTuple2[0], unionTuple2[1], unionTuple2["0"], unionTuple2["1"];
