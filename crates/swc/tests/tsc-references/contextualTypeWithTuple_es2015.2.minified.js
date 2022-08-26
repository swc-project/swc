class C {
}
var unionTuple = [
    new C(),
    "foo"
], unionTuple1 = [
    new C(),
    "foo"
], unionTuple2 = [
    new C(),
    "foo",
    new class {
    }()
];
unionTuple = unionTuple1, unionTuple = unionTuple2, unionTuple2 = unionTuple;
