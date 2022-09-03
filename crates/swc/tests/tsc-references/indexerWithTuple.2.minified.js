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
], idx0 = 0, idx1 = 1, ele10 = strNumTuple[0], ele11 = strNumTuple[1], ele12 = strNumTuple[2], ele13 = strNumTuple[idx0], ele14 = strNumTuple[idx1], ele15 = strNumTuple["0"], ele16 = strNumTuple["1"], strNumTuple1 = numTupleTuple[1], ele17 = numTupleTuple[2], ele19 = strNumTuple[-1], eleUnion10 = unionTuple1[0], eleUnion11 = unionTuple1[1], eleUnion12 = unionTuple1[2], eleUnion13 = unionTuple1[idx0], eleUnion14 = unionTuple1[idx1], eleUnion15 = unionTuple1["0"], eleUnion16 = unionTuple1["1"], eleUnion20 = unionTuple2[0], eleUnion21 = unionTuple2[1], eleUnion22 = unionTuple2[2], eleUnion23 = unionTuple2[idx0], eleUnion24 = unionTuple2[idx1], eleUnion25 = unionTuple2["0"], eleUnion26 = unionTuple2["1"];
