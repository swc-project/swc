//// [genericCallWithTupleType.ts]
i1.tuple1 = [
    "foo",
    5
];
var i1, i2, e1 = i1.tuple1[0], e2 = i1.tuple1[1];
i1.tuple1 = [
    "foo",
    5,
    !1,
    !0
];
var e3 = i1.tuple1[2];
i1.tuple1[3] = {
    a: "string"
};
var e4 = i1.tuple1[3];
i2.tuple1 = [
    "foo",
    5
], i2.tuple1 = [
    "foo",
    "bar"
], i2.tuple1 = [
    5,
    "bar"
], i2.tuple1 = [
    {},
    {}
], i1.tuple1 = [
    5,
    "foo"
], i1.tuple1 = [
    {},
    {}
], i2.tuple1 = [
    {}
];
