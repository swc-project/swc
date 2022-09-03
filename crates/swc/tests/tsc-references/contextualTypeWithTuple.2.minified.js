//// [contextualTypeWithTuple.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var numStrTuple = [
    5,
    "hello"
], numStrTuple2 = [
    5,
    "foo",
    !0
], numStrBoolTuple = [
    5,
    "foo",
    !0
], objNumTuple = [
    {
        a: "world"
    },
    5
], strTupleTuple = [
    "bar",
    [
        5,
        {
            x: 1,
            y: 1
        }
    ]
], C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
}, unionTuple = [
    new C(),
    "foo"
], unionTuple1 = [
    new C(),
    "foo"
], unionTuple2 = [
    new C(),
    "foo",
    new D()
], unionTuple3 = [
    10,
    "foo"
];
numStrTuple = numStrTuple2, objNumTuple = [
    {},
    5
], numStrBoolTuple = numStrTuple = numStrBoolTuple;
var strStrTuple = [
    "foo",
    "bar",
    5
];
unionTuple = unionTuple1, unionTuple2 = unionTuple = unionTuple2, numStrTuple = unionTuple3;
