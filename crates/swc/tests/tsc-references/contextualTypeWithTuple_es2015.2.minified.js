var numStrBoolTuple = [
    5,
    "foo",
    !0
];
class C {
}
new C(), new C();
var unionTuple2 = [
    new C(),
    "foo",
    new class {
    }()
];
numStrBoolTuple = numStrBoolTuple, unionTuple2 = unionTuple2;
